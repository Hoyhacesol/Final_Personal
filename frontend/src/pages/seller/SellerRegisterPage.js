import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext"
import { postSellerRegister,getSellerRegistered,getSellerRegisterInfo} from "../../api/SellerApi";
import { uploadImage,getImageUrl } from "../../api/UploadImageApi";
import "../../css/SellerRegisterPage.css";

const SellerRegisterPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const introInputRef = useRef();
  const { user,loading } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false); 

  const [previewUrls, setPreviewUrls] = useState({ main: null, intros: [] });
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    simage: [],
    introContent: "",
    info: "",
  });
  const [basicInfo, setBasicInfo] = useState({
    sname: "",
    phone: "",
    slocation: "",
  });

 useEffect(() => {
  if (loading) return; //로딩 중이면 아무 것도 하지 않음 
  const init = async () => {
    // user가 null이면 로그인 페이지로 이동
    if (user === null) {
       navigate("/login", { replace: true });
      return;
    }

    // SELLER 권한이 아니면 에러 페이지로 이동
    if (user.role !== "SELLER") {
      navigate("/errorpage");
      return;
    }

    // 이미 등록된 업체면 에러 페이지로 이동
    const registered = await getSellerRegistered();
    if (registered) {
      navigate("/errorpage");
      return;
    }

    try {
      const info = await getSellerRegisterInfo();
      setBasicInfo(info);
    } catch (e) {
      console.error("기본 정보 로딩 실패", e);
    }

    // 모든 조건 통과 시 등록 가능 상태로 설정
    setIsRegistered(true);
  };

  init();
}, [user, loading, navigate]);

  if (loading || !user || !isRegistered) return null;

  const handleMainChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // MIME 타입으로 이미지인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      fileInputRef.current.value = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
    alert("이미지 용량이 맞지 않습니다.");
    fileInputRef.current.value = null; 
    return;
  }

    const uploaded = await uploadImage([file]);
    const path = uploaded[0].path;
    const url = getImageUrl(path);

    setFormData((prev) => ({ ...prev, simage: [path, ...prev.simage.slice(1)] }));
    setPreviewUrls((prev) => ({ ...prev, main: url }));
  };

  const handleIntroChange = async (e) => {
    const files = Array.from(e.target.files);
    // 이미지 아닌 파일 있는지 확인
    const invalid = files.find(file => !file.type.startsWith("image/"));
    if (invalid) {
      alert("모든 파일은 이미지여야 합니다.");
      introInputRef.current.value = null;
      return;
    }
    
    const oversized = files.find(file => file.size > 10 * 1024 * 1024);
    if (oversized) {
      alert("이미지 용량이 맞지 않습니다.");
      return;
    }
    const uploaded = await uploadImage(files);
    const paths = uploaded.map((u) => u.path);
    const urls = uploaded.map((u) => u.url);

    setFormData((prev) => ({
      ...prev,
      simage: [prev.simage[0], ...prev.simage.slice(1), ...paths],
    }));

    setPreviewUrls((prev) => ({
      ...prev,
      intros: [...prev.intros, ...urls],
    }));

    introInputRef.current.value = null;
  };

  const handleSubmit = async () => {
  if (submitting) return; // 중복 제출 방지

  let { simage, introContent, info } = formData;

  // 대표 이미지 없으면 기본값 설정
  if (!simage.length || !simage[0]) {
    simage = ["default/default.png", ...simage.slice(1)];
  }

  if (!info || !introContent) {
    alert("업체 정보와 소개글을 작성해주세요.");
    return;
  }

  try {
    const sizes = await Promise.all(
      simage.map(async (path) => {
        const res = await fetch(getImageUrl(path));
        const blob = await res.blob();
        return blob.size;
      })
    );

    const totalSize = sizes.reduce((a, b) => a + b, 0);
    if (totalSize > 30 * 1024 * 1024) {
      alert("전체 이미지 용량이 맞지 않습니다.");
      return;
    }
  } catch (err) {}

  const payload = { simage, info, introContent };

  setSubmitting(true); // 등록 시작
  try {
    await postSellerRegister(payload);
    alert("등록 완료");
    navigate("/sellerlist");
  } catch (err) {
    console.error(err);
    alert("등록 실패");
  } finally {
    setSubmitting(false); // 등록 종료
  }
};
  
  const handleMainCancel = () => {
    setFormData((prev) => ({ ...prev, simage: [] }));
    setPreviewUrls((prev) => ({ ...prev, main: null }));
    fileInputRef.current.value = null;
  };

  const handleIntroCancel = () => {
    setFormData((prev) => ({ ...prev, simage: [prev.simage[0]] }));
    setPreviewUrls((prev) => ({ ...prev, intros: [] }));
    introInputRef.current.value = null;
  };

  const handleIntroRemove = (index) => {
    const updatedUrls = [...previewUrls.intros];
    const updatedPaths = [...formData.simage.slice(1)];

    updatedUrls.splice(index, 1);
    updatedPaths.splice(index, 1);

    setPreviewUrls((prev) => ({
      ...prev,
      intros: updatedUrls,
    }));

    setFormData((prev) => ({
      ...prev,
      simage: [prev.simage[0], ...updatedPaths],
    }));
  };

  return (
    <div className="container">
      <div className="main-simage" onClick={() => {
  // 기본 이미지일 때는 파일 선택만 실행
  if (!previewUrls.main) {
    fileInputRef.current.click();
  }
}}>
  <img
    src={previewUrls.main || getImageUrl("default/default.png")}
    alt="대표 이미지"
    onClick={(e) => {
      e.stopPropagation();
      // 대표 이미지가 있을 때만 확대
      if (previewUrls.main) {
        setEnlargedImage(previewUrls.main);
      } else {
        fileInputRef.current.click(); // 기본 이미지일 땐 클릭 시 파일 선택
      }
    }}
  />
</div>

      <input type="file" hidden ref={fileInputRef} onChange={handleMainChange} accept="image/*" />

      <div className="button-group">
        {!previewUrls.main && (
          <button className="button-blue" onClick={() => fileInputRef.current.click()}>
            대표 이미지 설정
          </button>
        )}
        {previewUrls.main && (
          <button className="button-red" onClick={handleMainCancel}>
            취소
          </button>
        )}
      </div>

        <div className="basic-info-text">
          <p><strong>업체이름:</strong> {basicInfo.sname}</p>
          <p><strong>연락처:</strong> {basicInfo.phone}</p>
          <p><strong>업체주소:</strong> {basicInfo.slocation}</p>
        </div>

      {previewUrls.intros.length > 0 && (
        <div className="slider-wrapper">
          {previewUrls.intros.length > 3 && (
            <button onClick={() => setSlideIndex((prev) => Math.max(prev - 3, 0))} className={`slider-button left ${slideIndex === 0 ? "disabled" : ""}`} disabled={slideIndex === 0}>
              &lt;
            </button>
          )}

          <div className="slider">
            {previewUrls.intros.slice(slideIndex, slideIndex + 3).map((src, idx) => {
              const globalIndex = slideIndex + idx;
              return (
                <div className="slider-img-wrapper" key={`${src}-${globalIndex}`}>
                  <img src={src} alt={`소개 ${globalIndex}`} onClick={() => setEnlargedImage(src)} />
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIntroRemove(globalIndex);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {previewUrls.intros.length > 3 && (
            <button
              onClick={() => setSlideIndex((prev) => prev + 3)}
              className={`slider-button right ${slideIndex + 3 >= previewUrls.intros.length ? "disabled" : ""}`}
              disabled={slideIndex + 3 >= previewUrls.intros.length}
            >
              &gt;
            </button>
          )}
        </div>
      )}

      <div className="button-group">
        <button className="button-blue" onClick={() => introInputRef.current.click()}>
          {previewUrls.intros.length === 0 ? "소개 이미지 설정" : "소개 이미지 추가"}
        </button>
        {previewUrls.intros.length > 0 && (
          <button className="button-red" onClick={handleIntroCancel}>
            취소
          </button>
        )}
      </div>
      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />
      <h2 className="info-title">업체 정보</h2>
      <input name="info" className="input-field" placeholder="업체 정보를 작성해주세요!" value={formData.info} onChange={(e) => setFormData((prev) => ({ ...prev, info: e.target.value }))} />
      <h2 className="content-title">업체 소개</h2>
      <textarea
        name="introContent"
        className="textarea"
        placeholder="업체소개 글을 작성해주세요!"
        value={formData.introContent}
        onChange={(e) => setFormData((prev) => ({ ...prev, introContent: e.target.value }))}
      />

      <button className="register-button" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "등록 중..." : "등록"}
        </button>

      {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerRegisterPage;
