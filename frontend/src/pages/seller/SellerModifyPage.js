import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearchLocation } from "react-icons/fa";
import { useAuth } from "../../contexts/Authcontext";
import { putSellerUpdate, getSellerModifyInfo, getSellerRegistered } from "../../api/SellerApi";
import { uploadImage, getImageUrl, removeImage, removeImageOnExit } from "../../api/UploadImageApi";
import styles from "../../css/SellerModifyPage.module.css";

const SellerModifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();
  const introInputRef = useRef();
  const registeredRef = useRef(false);
  const deleteQueueRef = useRef([]);
  const originalPathsRef = useRef([]);
  
  const { user, loading } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({ main: null, intros: [] });
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [prevAddress, setPrevAddress] = useState("");      // 원래 주소
  const [hasTempAddress, setHasTempAddress] = useState(false); // 임시 주소 상태인지

  const [formData, setFormData] = useState({
    simage: [],
    introContent: "",
    info: ""
  });
  const [basicInfo, setBasicInfo] = useState({
    sname: "",
    phone: "",
    slocation: ""
  });
  
  const isFormValid = basicInfo.sname.trim() && formData.info.trim() && formData.introContent.trim();
  
  
  useEffect(() => {
    if (loading) return;
    const init = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.role !== "SELLER") {
        navigate("/error");
        return;
      }
      // phone 미등록 회원->마이페이지로
      if (user?.phone?.startsWith("t") && location.pathname.startsWith("/sellerlist/modify")) {
        alert("미인증 회원에게 제한된 컨텐츠입니다.\n전화번호 인증을 먼저 해야 합니다.");
        navigate("/updateinfosocial");
        return;
      }
      const registered = await getSellerRegistered();
      if (!registered) {
        alert("아직 업체 등록을 하지 않았습니다. 먼저 등록을 진행해주세요.");
        navigate("/sellerlist/register");
        return;
      }
      setIsRegistered(true);
      const info = await getSellerModifyInfo();
      setBasicInfo({
        sname: info.sname || "",
        phone: info.phone || "",
        slocation: info.slocation || ""
      });
      setFormData({
        simage: info.simage || [],
        introContent: info.introContent || "",
        info: info.info || ""
      });

      originalPathsRef.current = info.simage || [];

      const urls = (info.simage || []).map(getImageUrl);
      setPreviewUrls({ main: urls[0] || null, intros: urls.slice(1) });
    };
    init();
  }, [user, loading, location, navigate]);

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

  const handleAddressSearch = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      setPrevAddress(basicInfo.slocation); // 현재 주소 백업
      setBasicInfo(prev => ({ ...prev, slocation: data.address }));
      setHasTempAddress(true); // 취소 버튼 표시
    }
  }).open();
};
  const handleCancelAddress = () => {
  setBasicInfo(prev => ({ ...prev, slocation: prevAddress }));
  setHasTempAddress(false);
};

  const handleMainChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      alert("유효한 이미지 파일을 선택해주세요.");
      fileInputRef.current.value = null;
      return;
    }
    const uploaded = await uploadImage([file]);
    const path = uploaded[0].path;
    deleteQueueRef.current.push(path);
    setFormData(prev => ({ ...prev, simage: [path, ...prev.simage.slice(1)] }));
    setPreviewUrls(prev => ({ ...prev, main: getImageUrl(path) }));
  };

  const handleIntroChange = async (e) => {
    const files = Array.from(e.target.files);
    const invalid = files.find(f => !f.type.startsWith("image/") || f.size > 10 * 1024 * 1024);
    if (invalid) {
      alert("유효한 이미지 파일을 선택해주세요.");
      introInputRef.current.value = null;
      return;
    }
    const uploaded = await uploadImage(files);
    const paths = uploaded.map(u => u.path);
    const urls = uploaded.map(u => u.url);
    deleteQueueRef.current.push(...paths);
    setFormData(prev => ({
      ...prev,
      simage: [prev.simage[0], ...prev.simage.slice(1), ...paths]
    }));
    setPreviewUrls(prev => ({ ...prev, intros: [...prev.intros, ...urls] }));
  };

  const handleIntroRemove = async (index) => {
    const paths = [...formData.simage.slice(1)];
    const removed = paths[index];
    const isOriginal = originalPathsRef.current.includes(removed);
    if (!isOriginal && removed !== "default/default.png") await removeImage(removed);
    deleteQueueRef.current = deleteQueueRef.current.filter(p => p !== removed);
    paths.splice(index, 1);
    const urls = [...previewUrls.intros];
    urls.splice(index, 1);

    const SLIDES_PER_VIEW = 3;
    const maxSlide = Math.max(0, urls.length - SLIDES_PER_VIEW);
    setSlideIndex(prev => Math.min(prev, maxSlide));
      
    setFormData(prev => ({ ...prev, simage: [prev.simage[0], ...paths] }));
    setPreviewUrls(prev => ({ ...prev, intros: urls }));
  };

  const handleMainCancel = async () => {
    const mainPath = formData.simage[0];
    const isOriginal = originalPathsRef.current.includes(mainPath);
    if (mainPath && !isOriginal && mainPath !== "default/default.png") await removeImage(mainPath);
    deleteQueueRef.current = deleteQueueRef.current.filter(p => p !== mainPath);
    setFormData(prev => ({ ...prev, simage: [] }));
    setPreviewUrls(prev => ({ ...prev, main: null }));
    fileInputRef.current.value = null;
  };

  const handleIntroCancel = () => {
  const introPaths = formData.simage.slice(1); // 대표 이미지 제외 소개 이미지 경로들
  introPaths.forEach((path) => {
    const isOriginal = originalPathsRef.current.includes(path);
    if (!isOriginal && path !== "default/default.png") {
      removeImage(path); // 서버에서 삭제
    }
    // deleteQueueRef에서도 제거 (이미 removeImage 호출 시점에 등록된 경우)
    deleteQueueRef.current = deleteQueueRef.current.filter(p => p !== path);
  });

  setFormData(prev => ({ ...prev, simage: [prev.simage[0]] }));
  setPreviewUrls(prev => ({ ...prev, intros: [] }));
  introInputRef.current.value = null;
};


  const handleSubmit = async () => {
    if (submitting) return;
    const { sname, slocation } = basicInfo;
    let { simage, info, introContent } = formData;
    if (!sname || !slocation || !info || !introContent) return alert("모든 정보를 입력해주세요.");
    if (!simage.length || !simage[0]) simage = ["default/default.png", ...simage.slice(1)];
    setSubmitting(true);
    try {
      const originals = originalPathsRef.current;
      const removedOriginals = originals.filter(path => !simage.includes(path));
      await Promise.all(removedOriginals.map(removeImage));
      await putSellerUpdate({ simage, info, introContent, sname, slocation });
      registeredRef.current = true;
      deleteQueueRef.current = [];
      alert("업체 정보가 수정되었습니다.");
      navigate("/mypage");
    } catch (e) {
      console.error(e);
      alert("수정 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["main_simage"]} onClick={() => !previewUrls.main && fileInputRef.current.click()}>
        <img
          src={previewUrls.main || getImageUrl("default/default.png")}
          alt="대표 이미지"
          onClick={(e) => {
          e.stopPropagation();
          if (
            previewUrls.main &&
            !previewUrls.main.includes("default/default.png")
          ) {
            setEnlargedImage(previewUrls.main);
          } else {
            fileInputRef.current.click();
          }
        }}
        />
      </div>

      <input type="file" hidden ref={fileInputRef} onChange={handleMainChange} accept="image/*" />

      <div className={styles["button_group"]}>
        {!previewUrls.main || previewUrls.main.includes("default/default.png") ? (
          <button className={styles["button_blue"]} onClick={() => fileInputRef.current.click()}>대표 이미지 설정</button>
        ) : (
          <button className={styles["button_red"]} onClick={handleMainCancel}>취소</button>
        )}
      </div>

      <div className={styles["basic_info_form"]}>
  <div>
    <label htmlFor="sname">업체 이름</label>
    <input
      id="sname"
      type="text"
      maxLength={20}
      autoComplete="off"
      value={basicInfo.sname}
      onChange={(e) => setBasicInfo(prev => ({ ...prev, sname: e.target.value }))}
    />
  </div>

  <div>
    <label htmlFor="phone">연락처</label>
    <input
      id="phone"
      type="text"
      value={basicInfo.phone}
      readOnly
      tabIndex={-1}
    />
  </div>

  <div className={styles["address_input_wrapper"]}>
  <label htmlFor="slocation">업체 주소</label>
  <div className={styles["address_input"]}>
    <input
      id="slocation"
      type="text"
      value={basicInfo.slocation}
      readOnly
    />
    <button
      type="button"
      className={styles["address_search_button"]}
      onClick={handleAddressSearch}
      aria-label="주소 검색"
    >
      <FaSearchLocation />
    </button>
  {hasTempAddress && (
  
    <button className={styles["button_red"]} onClick={handleCancelAddress}>취소</button>
  
)}
  </div>

</div>

</div>

      {previewUrls.intros.length > 0 && (
        <div className={styles["slider_wrapper"]}>
          {previewUrls.intros.length > 3 && (
            <button
              onClick={() => setSlideIndex(prev => Math.max(prev - 3, 0))}
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
              onClick={() => setSlideIndex(prev => prev + 3)}
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
          {previewUrls.intros.length === 0 ? '소개 이미지 설정' : '소개 이미지 추가'}
        </button>
        {previewUrls.intros.length > 0 && (
          <button className={styles["button_red"]} onClick={handleIntroCancel}>취소</button>
        )}
      </div>

      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />

      <h2 className={styles["info_title"]}>업체 정보</h2>
      <input
        name="info"
        className={styles["input_field"]}
        autoComplete="off"
        placeholder="업체 정보를 작성해주세요!"
        maxLength={255}
        value={formData.info}
        onChange={e => setFormData(prev => ({ ...prev, info: e.target.value }))}
      />
      <h2 className={styles["content_title"]}>업체 소개</h2>
      <textarea
        name="introContent"
        className={styles["textarea"]}
        placeholder="업체소개 글을 작성해주세요!"
        maxLength={255}
        value={formData.introContent}
        onChange={e => setFormData(prev => ({ ...prev, introContent: e.target.value }))}
      />
      <button
        className={`${styles["register_button"]} ${!isFormValid ? styles["disabled_button"] : ""}`}
        onClick={handleSubmit}
        disabled={!isFormValid || submitting}
      >
        {submitting ? "수정 중..." : "수정 완료"}
      </button>

      {enlargedImage && (
        <div className={styles["image_modal"]} onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerModifyPage;
