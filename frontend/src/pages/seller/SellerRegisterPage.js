import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSellerRegister } from "../../api/SellerApi";
import { uploadImage,getImageUrl } from "../../api/UploadImageApi";
import "../../css/SellerRegisterPage.css";



const SellerRegisterPage = ({ mno }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    simage: [],
    introContent: "",
    info: ""
  });
  const [previewUrls, setPreviewUrls] = useState({ main: null, intros: [] });
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fileInputRef = useRef();
  const introInputRef = useRef();

  const handleMainChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploaded = await uploadImage([file]);
    const path = uploaded[0].path;
    const url = getImageUrl(path);

    setFormData(prev => ({ ...prev, simage: [path, ...prev.simage.slice(1)] }));
    setPreviewUrls(prev => ({ ...prev, main: url }));
  };

  const handleIntroChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = await uploadImage(files);
    const paths = uploaded.map(u => u.path);
    const urls = uploaded.map(u => u.url);

    setFormData(prev => ({
      ...prev,
      simage: [prev.simage[0], ...prev.simage.slice(1), ...paths]
    }));

    setPreviewUrls(prev => ({
      ...prev,
      intros: [...prev.intros, ...urls]
    }));

    introInputRef.current.value = null;
  };

  const handleSubmit = async () => {
  const { simage, introContent, info } = formData;

  if (!simage.length || !info || !introContent) {
    alert("모든 정보를 입력해주세요.");
    return;
  }

  const payload = {
    simage,
    info,
    introContent
  };

  try {
    await postSellerRegister(mno, payload);            
    alert("등록 완료");
    navigate("/sellerlist");
  } catch (err) {
    console.error(err);
    alert("등록 실패");
  }
};

  const handleMainCancel = () => {
    setFormData(prev => ({ ...prev, simage: [] }));
    setPreviewUrls(prev => ({ ...prev, main: null }));
    fileInputRef.current.value = null;
  };

  const handleIntroCancel = () => {
    setFormData(prev => ({ ...prev, simage: [prev.simage[0]] }));
    setPreviewUrls(prev => ({ ...prev, intros: [] }));
    introInputRef.current.value = null;
  };

  const handleIntroRemove = (index) => {
  const updatedUrls = [...previewUrls.intros];
  const updatedPaths = [...formData.simage.slice(1)]; 

  updatedUrls.splice(index, 1);
  updatedPaths.splice(index, 1);

  setPreviewUrls(prev => ({
    ...prev,
    intros: updatedUrls
  }));

  setFormData(prev => ({
    ...prev,
    simage: [prev.simage[0], ...updatedPaths]
  }));
};

  return (
    <div className="container">
      <div className="main-simage" onClick={() => fileInputRef.current.click()}>
        {previewUrls.main ? (
          <img
            src={previewUrls.main}
            alt="대표 이미지"
            onClick={e => {
              e.stopPropagation();
              setEnlargedImage(previewUrls.main);
            }}
          />
        ) : (
          <div className="clickable-content">
            <div className="img-placeholder">🖼️</div>
            <div className="click-text">대표 이미지를 설정해주세요!</div>
          </div>
        )}
      </div>
      <input type="file" hidden ref={fileInputRef} onChange={handleMainChange} accept="image/*" />

     <div className="button-group">
        {!previewUrls.main && (
          <button className="button-blue" onClick={() => fileInputRef.current.click()}>대표 이미지 설정</button>
        )}
        {previewUrls.main && (
          <button className="button-red" onClick={handleMainCancel}>취소</button>
        )}
      </div>


 {previewUrls.intros.length > 0 && (
  <div className="slider-wrapper">
    {previewUrls.intros.length > 3 && (
      <button
        onClick={() => setSlideIndex(prev => Math.max(prev - 3, 0))}
        className={`slider-button left ${slideIndex === 0 ? "disabled" : ""}`}
        disabled={slideIndex === 0}
      >
        &lt;
      </button>
    )}

    <div className="slider">
      {previewUrls.intros.slice(slideIndex, slideIndex + 3).map((src, idx) => {
        const globalIndex = slideIndex + idx;
        return (
          <div className="slider-img-wrapper" key={`${src}-${globalIndex}`}>
            <img
              src={src}
              alt={`소개 ${globalIndex}`}
              onClick={() => setEnlargedImage(src)}
            />
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
        onClick={() => setSlideIndex(prev => prev + 3)}
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
        {previewUrls.intros.length === 0 ? '소개 이미지 설정' : '소개 이미지 추가'}
      </button>
      {previewUrls.intros.length > 0 && (
        <button className="button-red" onClick={handleIntroCancel}>취소</button>
      )}
    </div> 
      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />
      <h2 className="info-title">업체 정보</h2>
      <input
        name="info"
        className="input-field"
        placeholder="업체 정보를 작성해주세요!"
        value={formData.info}
        onChange={e => setFormData(prev => ({ ...prev, info: e.target.value }))}
      />
      <h2 className="content-title">업체 소개</h2>
      <textarea
        name="introContent"
        className="textarea"
        placeholder="업체소개 글을 작성해주세요!"
        value={formData.introContent}
        onChange={e => setFormData(prev => ({ ...prev, introContent: e.target.value }))}
      />

      <button className="register-button" onClick={handleSubmit}>등록</button>

      {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerRegisterPage;
