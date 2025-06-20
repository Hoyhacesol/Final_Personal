import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import {
  getSellerList,
  getSellerDetail,
  getSellerRegistered,
} from "../../api/SellerApi";
import { getImageUrl } from "../../api/UploadImageApi";
import Pagination from "../../components/paging/Pagination";
import "../../css/SellerListPage.css";

const SellerListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(pageFromUrl);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checked, setChecked] = useState(false);

  const [sellerData, setSellerData] = useState({
    dtoList: [],
    pageList: [],
    currentPage: 1,
    totalPage: 0,
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
  });

  // 이미지 경로 안전 처리 함수
  const getSafeImage = (simage) => {
  if (!Array.isArray(simage)) return "default/default.png";
  const first = simage[0]?.trim();
  if (!first || first === "undefined") return "default/default.png";
  return first;
 };

  useEffect(() => {
    if (user?.role !== "SELLER") return;

    const fetchRegistration = async () => {
      const registered = await getSellerRegistered();
      setIsRegistered(registered);
      setChecked(true);
    };

    fetchRegistration();
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getSellerList(page, 12).then((data) => setSellerData(data));
  }, [page]);

  useEffect(() => {
    setSearchParams({ page });
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
        <h2 className="page-title">업체 정보 한눈에 보기</h2>
        <p className="page-subtitle">
          고객 요청에 맞춰 입찰한 업체들을 빠르게 비교해보세요.
        </p>
        {user?.role === "SELLER" && checked && !isRegistered && (
          <button className="register-btn" onClick={goToRegister}>
            업체소개 등록
          </button>
        )}
      </div>

      <div className="card-container">
        {sellerData.dtoList.map((seller, idx) => (
          <div className="card" key={idx} onClick={() => openModal(seller.mno)}>
            <div className="card-header">
              <div className="image">
                <img src={getImageUrl(getSafeImage(seller.simage))} alt="대표" />
              </div>
              <div className="count">선정 횟수: {seller.hiredCount || 0}</div>
            </div>
            <div className="info">
              <div className="name">{seller.sname || "업체명 없음"}</div>
              <div className="address">{seller.slocation || "주소 없음"}</div>
            </div>
            <button className="detail-btn">상세정보</button>
          </div>
        ))}
      </div>

      <Pagination
        className="fixed-pagination"
        current={sellerData.currentPage}
        pageList={sellerData.pageList}
        prev={sellerData.prev}
        next={sellerData.next}
        prevPage={sellerData.prevPage}
        nextPage={sellerData.nextPage}
        onPageChange={(pageNum) => setPage(pageNum)}
      />

      {/* 상세 모달 */}
      {modalOpen && selectedSeller && (() => {
        const simage = selectedSeller.simage;
        const mainImg = getSafeImage(simage);

        return (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>상세정보</h3>
                <button onClick={closeModal}>✕</button>
              </div>

              <div className="modal-body">
                <div className="seller-top">
                  <div className={`seller-image ${mainImg === "default/default.png" ? "non-clickable" : "clickable"}`}
                       onClick={() => {
                        if (mainImg !== "default/default.png") {
                          setEnlargedImage(getImageUrl(mainImg));
                        }
                      }}
                    >
                      <img src={getImageUrl(mainImg)} alt="대표" />
                    </div>
                  <div className="seller-info">
                    <strong>{selectedSeller.sname || "업체명 없음"}</strong>
                    <br />
                    연락처: {selectedSeller.phone || "정보 없음"}
                    <br />
                    주소: {selectedSeller.slocation || "정보 없음"}
                    <br />
                  </div>
                </div>

                {Array.isArray(simage) && simage.length > 1 && simage.slice(1).some(img => img?.trim()) && (
                  <div className="image-slider">
                    {simage.length > 4 && slideIndex > 0 && (
                      <button
                        onClick={() => setSlideIndex((prev) => Math.max(prev - 3, 0))}
                        className="slider-button"
                      >
                        {"<"}
                      </button>
                    )}

                    {simage
                      .slice(1)
                      .slice(slideIndex, slideIndex + 3)
                      .filter(img => img?.trim())
                      .map((img, i) => (
                        <div
                          className="img-box"
                          key={i}
                          onClick={() => setEnlargedImage(getImageUrl(img))}
                        >
                          <img src={getImageUrl(img)} alt={`소개 ${i}`} />
                        </div>
                      ))}

                    {simage.length > 4 &&
                      slideIndex + 3 < simage.length - 1 && (
                        <button
                          onClick={() => setSlideIndex((prev) => prev + 3)}
                          className="slider-button"
                        >
                          {">"}
                        </button>
                      )}
                  </div>
                )}

                <div className="seller-detail">
                  <p>
                    <strong>업체정보</strong>
                    <br />
                    {selectedSeller.info || "정보 없음"}
                  </p>
                  <p>
                    <strong>업체소개</strong>
                    <br />
                    {selectedSeller.introContent || "소개 없음"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 확대 이미지 모달 */}
      {enlargedImage && (
        <div className="modal-overlay" onClick={() => setEnlargedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>이미지 보기</h3>
              <button onClick={() => setEnlargedImage(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <img
                src={enlargedImage}
                alt="확대 이미지"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListPage;
