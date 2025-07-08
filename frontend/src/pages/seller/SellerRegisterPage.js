import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import {
  postSellerRegister,
  getSellerRegistered,
  getSellerRegisterInfo
} from "../../api/SellerApi";
import {
  uploadImage,
  getImageUrl,
  removeImageOnExit,
  removeImage
} from "../../api/UploadImageApi";
import "../../css/Sharesheet.css"
import styles from "../../css/SellerRegisterPage.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SellerRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();
  const introInputRef = useRef();
  const registeredRef = useRef(false);
  const deleteQueueRef = useRef([]);
  const { user, loading } = useAuth();
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

const isFormValid = formData.info.trim() && formData.introContent.trim();
  
  
  useEffect(() => {
    if (loading) return;
    const init = async () => {
      if (user === null) {
        navigate("/login", { replace: true });
        return;
      }
      if (user.role !== "SELLER") {
        navigate("/error");
        return;
      }
      // phone 미등록 회원->마이페이지로
      if (user?.phone?.startsWith("t") && location.pathname.startsWith("/sellerlist/register")) {
        alert("미인증 회원에게 제한된 컨텐츠입니다.\n전화번호 인증을 먼저 해야 합니다.");
        navigate("/updateinfosocial");
        return;
      }
      const registered = await getSellerRegistered();
      if (registered) {
        navigate("/error");
        return;
      }
      try {
        const info = await getSellerRegisterInfo();
        setBasicInfo(info);
      } catch (e) {
        console.error("기본 정보 로딩 실패", e);
      }
      setIsRegistered(true);
    };
    init();
  }, [user, loading,location, navigate]);

  useEffect(() => {
    const cleanUpOnUnload = () => {
      if (registeredRef.current) return;
      deleteQueueRef.current.forEach(removeImageOnExit);
    };
    window.addEventListener("beforeunload", cleanUpOnUnload);
    window.addEventListener("pagehide", cleanUpOnUnload);

    return () => {
      window.removeEventListener("beforeunload", cleanUpOnUnload);
      window.removeEventListener("pagehide", cleanUpOnUnload);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (!registeredRef.current) {
        deleteQueueRef.current.forEach(removeImageOnExit);
      }
    };
  }, [location.pathname]);


  if (loading || !user || !isRegistered) return null;

  const handleMainChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
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
    const url = uploaded[0].url;
    deleteQueueRef.current.push(path);
    setFormData((prev) => ({ ...prev, simage: [path, ...prev.simage.slice(1)] }));
    setPreviewUrls((prev) => ({ ...prev, main: url }));
    fileInputRef.current.value = null;
  };

  const handleIntroChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.some(f => !f.type.startsWith("image/"))) {
      alert("모든 파일은 이미지여야 합니다.");
      introInputRef.current.value = null;
      return;
    }
    if (files.some(f => f.size > 10 * 1024 * 1024)) {
      alert("이미지 용량이 맞지 않습니다.");
      return;
    }
    const uploaded = await uploadImage(files);
    const paths = uploaded.map(u => u.path);
    const urls = uploaded.map(u => u.url);
    deleteQueueRef.current.push(...paths);
    setFormData((prev) => ({
      ...prev,
      simage: [prev.simage[0], ...prev.simage.slice(1), ...paths],
    }));
    setPreviewUrls((prev) => ({ ...prev, intros: [...prev.intros, ...urls] }));
    introInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    let { simage, introContent, info } = formData;
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
    } catch {}

    const payload = { simage, info, introContent };
    setSubmitting(true);
    try {
      await postSellerRegister(payload);
      registeredRef.current = true;
      deleteQueueRef.current = []; // 등록 완료 시 삭제 큐 비움
      alert("등록 완료");
      navigate("/sellerlist");
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleMainCancel = () => {
  const mainPath = formData.simage[0];

  if (mainPath && mainPath !== "default/default.png") {
    removeImage(mainPath); // 서버에서 삭제 요청
    deleteQueueRef.current = deleteQueueRef.current.filter(p => p !== mainPath); // 삭제 큐에서 제거
  }

  setFormData(prev => ({ ...prev, simage: [] }));
  setPreviewUrls(prev => ({ ...prev, main: null }));
  fileInputRef.current.value = null;
};


  const handleIntroCancel = async () => {
  const introPaths = formData.simage.slice(1); // 대표 이미지를 제외한 소개 이미지 경로들

  try {
    await Promise.all(
      introPaths
        .filter(path => path !== "default/default.png") // 기본 이미지 제외
        .map(path => {
          removeImage(path); // 서버에서 삭제 요청
          return path;
        })
    );

    // 삭제 큐에서도 제거
    deleteQueueRef.current = deleteQueueRef.current.filter(p => !introPaths.includes(p));
  } catch (err) {
    console.error("소개 이미지 삭제 실패", err);
  }

  setFormData(prev => ({ ...prev, simage: [prev.simage[0]] }));
  setPreviewUrls(prev => ({ ...prev, intros: [] }));
  introInputRef.current.value = null;
};


  const handleIntroRemove = async (index) => {
  const updatedUrls = [...previewUrls.intros];
  const updatedPaths = [...formData.simage.slice(1)];
  const removedPath = updatedPaths[index];

  if (removedPath && removedPath !== "default/default.png") {
    try {
      removeImage(removedPath); // 서버에서 삭제 요청
      deleteQueueRef.current = deleteQueueRef.current.filter(p => p !== removedPath); // 삭제 큐에서 제거
    } catch (err) {
      console.error("소개 이미지 삭제 실패", err);
    }
  }

  updatedUrls.splice(index, 1);
  updatedPaths.splice(index, 1);

  const newSlideIndex = Math.min(slideIndex, Math.max(0, updatedUrls.length - 3));
  setSlideIndex(newSlideIndex);

  setPreviewUrls(prev => ({ ...prev, intros: updatedUrls }));
  setFormData(prev => ({ ...prev, simage: [prev.simage[0], ...updatedPaths] }));
};


  return (
    <div className={styles["container"]}>
      <div className={styles["main_simage"]} onClick={() => {
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

      <div className={styles["button_group"]}>
        {!previewUrls.main && (
          <button className={styles["button_blue"]} onClick={() => fileInputRef.current.click()}>
            대표 이미지 설정
          </button>
        )}
        {previewUrls.main && (
          <button className={styles["button_red"]} onClick={handleMainCancel}>
            취소
          </button>
        )}
      </div>

        <div className={styles["basic_info_text"]}>
          <p><strong>업체이름:</strong> {basicInfo.sname}</p>
          <p><strong>연락처:</strong> {basicInfo.phone}</p>
          <p><strong>업체주소:</strong> {basicInfo.slocation}</p>
        </div>

      {previewUrls.intros.length > 0 && (
        <div className={styles["slider_wrapper"]}>
          {previewUrls.intros.length > 3 && (
            <button
            onClick={() => setSlideIndex((prev) => Math.max(prev - 3, 0))}
            className={`${styles.slider_button} ${styles.left} ${slideIndex === 0 ? styles.disabled : ""}`}
            disabled={slideIndex === 0}
          >
            &lt;
          </button>

          )}

          <div className={styles["slider"]}>
            {previewUrls.intros.slice(slideIndex, slideIndex + 3).map((src, idx) => {
              const globalIndex = slideIndex + idx;
              return (
                <div className={styles["slider_img_wrapper"]} key={`${src}-${globalIndex}`}>
                  <img src={src} alt={`소개 ${globalIndex}`} onClick={() => setEnlargedImage(src)} />
                  <button
                    className={styles["delete_button"]}
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
              className={`${styles.slider_button} ${styles.right} ${slideIndex + 3 >= previewUrls.intros.length ? styles.disabled : ""}`}
              disabled={slideIndex + 3 >= previewUrls.intros.length}
            >
              &gt;
            </button>
          )}
        </div>
      )}

      <div className={styles["button_group"]}>
        <button className={styles["button_blue"]} onClick={() => introInputRef.current.click()}>
          {previewUrls.intros.length === 0 ? "소개 이미지 설정" : "소개 이미지 추가"}
        </button>
        {previewUrls.intros.length > 0 && (
          <button className={styles["button_red"]} onClick={handleIntroCancel}>
            취소
          </button>
        )}
      </div>
      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />
      <h2 className={styles["info_title"]}>업체 정보</h2>
      <input name="info" 
        className={styles["input_field"]} 
        placeholder="업체 정보를 작성해주세요!" 
        autoComplete="off" 
        maxLength={255} 
        value={formData.info} 
        onChange={(e) => setFormData((prev) => ({ ...prev, info: e.target.value }))} 
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        />
        
      <h2 className={styles["content_title"]}>업체 소개</h2>
      <textarea
        name="introContent"
        className={styles["textarea"]}
        placeholder="업체소개 글을 작성해주세요!"
        maxLength={255}
        value={formData.introContent}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onChange={(e) => setFormData((prev) => ({ ...prev, introContent: e.target.value }))}
      />

      <button
          className={`${styles["register_button"]} ${!isFormValid ? styles["disabled_button"] : ""}`}
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "등록 중..." : "등록"}
        </button>


      {enlargedImage && (
        <div className={styles["image_modal"]} onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerRegisterPage;