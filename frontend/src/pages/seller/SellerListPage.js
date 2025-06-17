import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerList, getSellerDetail } from "../../api/SellerApi";
import { getImageUrl } from "../../api/UploadImageApi";
import Pagination from "../../components/paging/Pagination";
import "../../css/SellerListPage.css";

const SellerListPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [page, setPage] = useState(1);

  const [sellerData, setSellerData] = useState({
  dtoList: [],
  pageList: [],
  currentPage: 1,
  totalPage: 0,
  prev: false,
  next: false,
  prevPage: 0,
  nextPage: 0
});

  useEffect(() => {
    window.scrollTo(0, 0);

    getSellerList(page, 12)
      .then(data => setSellerData(data))
      .catch(err => console.error("리스트 불러오기 실패", err));
  }, [page]);

  const openModal = async (mno) => {
    try {
      const detail = await getSellerDetail(mno);
      setSelectedSeller(detail);
      setSlideIndex(0);
      setModalOpen(true);
    } catch (err) {
      console.error("상세 불러오기 실패", err);
    }
  };

  const closeModal = () => setModalOpen(false);
  const goToRegister = () => navigate("/sellerlist/register");

  return (
    <div id="wrap-container">
      <div className="header">
        <h2>업체정보</h2>
        <button className="register-btn" onClick={goToRegister}>업체소개 등록</button>
      </div>

      <div className="card-container">
        {sellerData.dtoList.map((seller, idx) => (
          <div className="card" key={idx} onClick={() => openModal(seller.mno)}>
            <div className="card-header">
              <div className="image">
                <img src={getImageUrl(seller.simage[0])} alt="대표" />
              </div>
              <div className="count">선정 횟수: {seller.selectCount || 0}</div>
            </div>
            <div className="info">
              <div className="name">{seller.sname}</div>
              <div className="address">{seller.slocation}</div>
            </div>
            <button className="detail-btn">상세정보</button>
          </div>
        ))}
      </div>

      {/* 페이징 버튼 */}
      <Pagination
        current={sellerData.currentPage}
        pageList={sellerData.pageList}
        prev={sellerData.prev}
        next={sellerData.next}
        prevPage={sellerData.prevPage}   
        nextPage={sellerData.nextPage}
        onPageChange={(pageNum) => setPage(pageNum)}
      />

      {/* 상세 모달 */}
      {modalOpen && selectedSeller && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>상세정보</h3>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="seller-top">
                <div className="seller-image" onClick={() => setEnlargedImage(getImageUrl(selectedSeller.simage[0]))}>
                  <img src={getImageUrl(selectedSeller.simage[0])} alt="대표" />
                </div>
                <div className="seller-info">
                  <strong>{selectedSeller.sname}</strong><br />
                  연락처: {selectedSeller.phone}<br />
                  주소: {selectedSeller.slocation}<br />
                </div>
              </div>

              {selectedSeller.simage.length > 1 && (
                <div className="image-slider">
                  {selectedSeller.simage.length - 1 > 3 && slideIndex > 0 && (
                    <button onClick={() => setSlideIndex(prev => Math.max(prev - 3, 0))} className="slider-button">
                      {"<"}
                    </button>
                  )}

                  {selectedSeller.simage
                    .slice(1)
                    .slice(slideIndex, slideIndex + 3)
                    .map((img, i) => (
                      <div className="img-box" key={i} onClick={() => setEnlargedImage(getImageUrl(img))}>
                        <img src={getImageUrl(img)} alt={`소개 ${i}`} />
                      </div>
                    ))}

                  {selectedSeller.simage.length - 1 > 3 && slideIndex + 3 < selectedSeller.simage.length - 1 && (
                    <button onClick={() => setSlideIndex(prev => prev + 3)} className="slider-button">
                      {">"}
                    </button>
                  )}
                </div>
              )}

              <div className="seller-detail">
                <p><strong>업체정보</strong><br />{selectedSeller.info}</p>
                <p><strong>업체소개</strong><br />{selectedSeller.introContent}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {enlargedImage && (
        <div className="modal-overlay" onClick={() => setEnlargedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>이미지 보기</h3>
              <button onClick={() => setEnlargedImage(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <img src={enlargedImage} alt="확대 이미지" style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "12px" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListPage;
