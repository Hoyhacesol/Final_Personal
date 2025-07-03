// src/pages/MainPage.js
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { getOrderList } from "../api/RequestApi";
import { getList as getCommunityList } from "../api/communityApi";
import { getSellerList, getSellerDetail } from "../api/SellerApi";
import { getImageUrl } from "../api/UploadImageApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/MainPage.css";
import { FaRunning, FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const bannerImages = [
  "img/banner1.png",
  "img/banner2.png",
  "img/banner3.jpg",
  "img/banner4.png",
  "img/banner5.png",
];

const MainPage = () => {
  const navigate = useNavigate();

  // --- 기존 상태들 ---
  const [orders, setOrders] = useState([]);
  const [community, setCommunity] = useState([]);
  const [sellers, setSellers] = useState([]);

  // --- 모달 제어용 상태 추가 ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // 기준 이하일 때 Slider 대신 flex 레이아웃으로
  const orderSlides = 5;
  const sellerSlides = 5;

  useEffect(() => {
    getOrderList(1, 5)
      .then(res => setOrders(res.dtoList))
      .catch(console.error);

    getCommunityList({ page: 1, size: 5 })
      .then(res => setCommunity(res.dtoList))
      .catch(console.error);

    getSellerList(1, 8)
      .then(res => setSellers(res.dtoList))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleBodyLock = () => {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (modalOpen || enlargedImage) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };

    handleBodyLock();
    window.addEventListener("resize", handleBodyLock);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("resize", handleBodyLock);
    };
  }, [modalOpen, enlargedImage]);

  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const multiSlideSettings = {
    dots: false,
    infinite: true,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // 이미지 안전 처리 헬퍼
  const getSafeImage = simage => {
    if (!Array.isArray(simage)) return "default/default.png";
    const first = simage[0]?.trim();
    return (first && first !== "undefined") ? first : "default/default.png";
  };

  // 모달 열기/닫기 함수
  const openModal = async mno => {
    try {
      const detail = await getSellerDetail(mno);
      setSelectedSeller(detail);
      setEnlargedImage(null);
      setModalOpen(true);
    } catch (err) {
      console.error("업체 상세 불러오기 실패", err);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSeller(null);
    setEnlargedImage(null);
  };

  return (
    <div id="mainPage">
      {/* 배너 섹션 */}
      <section className="banner_section">
        <Slider {...bannerSettings}>
          {bannerImages.map((src, idx) => (
            <div key={idx} className="banner_item">
              <img src={src} alt={`배너-${idx + 1}`} />
            </div>
          ))}
        </Slider>
      </section>

      {/* 최근 주문 섹션 */}
      <section className="orderlist_section">
        <h2>최근 견적 요청</h2>
        {orders.length > 0 ? (
          orders.length > orderSlides ? (
            <Slider {...multiSlideSettings}>
              {orders.map(o => (
                <div
                  key={o.ono}
                  className="order_item item"
                  onClick={() => navigate(`/request/read/${o.ono}`)}
                >
                  <div className="order_title">{o.ocontent}</div>
                  <div>
                    <p><FaRunning /> {o.playType}</p>
                    <p><FaMapMarkerAlt /> {o.olocation}</p>
                    <p><FaRegCalendarAlt /> {o.rentalDate?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="orderlist_simple">
              {orders.map(o => (
                <div
                  key={o.ono}
                  className="order_item item"
                  onClick={() => navigate(`/request/read/${o.ono}`)}
                >
                  <div className="order_title">{o.ocontent}</div>
                  <div>
                    <p><FaRunning /> {o.playType}</p>
                    <p><FaMapMarkerAlt /> {o.olocation}</p>
                    <p><FaRegCalendarAlt /> {o.rentalDate?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="empty-message">아직 견적 요청이 없습니다.</p>
        )}
      </section>

      {/* 커뮤니티 섹션 */}
      <section className="community_section">
        <h2>커뮤니티 최신글</h2>
        {community.length > 0 ? (
          <ul className="community_list">
            {community.map(c => (
              <li
                key={c.pno}
                className="community_item item"
                onClick={() => navigate(`/community/read/${c.pno}`)}
              >
                <div className="community_title">{c.ptitle}</div>
                <div className="community_info">
                  <span>{c.writerName}</span>
                  <span>{new Date(c.pregdate).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">자유게시판에 최신 글이 없습니다.</p>
        )}
      </section>

      {/* 추천 업체 섹션 */}
      <section className="sellerlist_section">
        <h2>추천 업체</h2>
        {sellers.length > 0 ? (
          sellers.length > sellerSlides ? (
            <Slider {...multiSlideSettings}>
              {sellers.map(seller => {
                const thumb = getSafeImage(seller.simage);
                return (
                  <div
                    key={seller.mno}
                    className="seller_item item"
                    onClick={() => openModal(seller.mno)}
                  >
                    <img
                      src={getImageUrl(thumb)}
                      alt={seller.sname}
                      className="seller_thumb"
                    />
                    <h3 className="seller_name">{seller.sname}</h3>
                    <div>선정 횟수: {seller.hiredCount}</div>
                    <div>{seller.slocation || "주소 없음"}</div>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <div className="sellerlist_simple">
              {sellers.map(seller => {
                const thumb = getSafeImage(seller.simage);
                return (
                  <div
                    key={seller.mno}
                    className="seller_item item"
                    onClick={() => openModal(seller.mno)}
                  >
                    <img
                      src={getImageUrl(thumb)}
                      alt={seller.sname}
                      className="seller_thumb"
                    />
                    <h3 className="seller_name">{seller.sname}</h3>
                    <div>선정 횟수: {seller.hiredCount}</div>
                    <div>{seller.slocation || "주소 없음"}</div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <p className="empty-message">추천 업체가 없습니다.</p>
        )}
      </section>

      {/* ◆ 모달창 */}
      {modalOpen && selectedSeller && (() => {
        const mainImg = getSafeImage(selectedSeller.simage);
        return (
          <div className="modal_overlay" onClick={closeModal}>
            <div className="modal_content" onClick={e => e.stopPropagation()}>
              <div className="modal_header">
                <h3>업체 상세 정보</h3>
                <button onClick={closeModal}>✕</button>
              </div>
              <div className="modal_body">
                <div className="seller_top">
                  <div
                    className={`seller_image ${mainImg === "default/default.png" ? "non_clickable" : "clickable"}`}
                    onClick={() => {
                      if (mainImg !== "default/default.png") {
                        setEnlargedImage(getImageUrl(mainImg));
                      }
                    }}
                  >
                    <img src={getImageUrl(mainImg)} alt="대표 이미지" />
                  </div>
                  <div className="seller_info">
                    <strong>{selectedSeller.sname}</strong><br />
                    연락처: {selectedSeller.phone || "정보 없음"}<br />
                    주소: {selectedSeller.slocation || "정보 없음"}
                  </div>
                  <div className="seller_inforeview">
                    <div>선정 횟수 : {selectedSeller.hiredCount || 0}</div>
                    <div>리뷰 평점 : {selectedSeller.avgRating || 0}</div>
                    <div>리뷰 개수 : {selectedSeller.reviewCount || 0}</div>
                  </div>
                </div>
                <div className="seller_detail">
                  <p><strong>업체정보</strong><br />{selectedSeller.info || "정보 없음"}</p>
                  <p><strong>업체소개</strong><br />{selectedSeller.introContent || "소개 없음"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ◆ 이미지 확대 모달 */}
      {enlargedImage && (
        <div className="modal_overlay" onClick={closeModal}>
          <div className="modal_content" onClick={e => e.stopPropagation()}>
            <div className="modal_header">
              <h3>이미지 확대 보기</h3>
              <button onClick={closeModal}>✕</button>
            </div>
            <div className="modal_body" style={{ textAlign: "center" }}>
              <img
                src={enlargedImage}
                alt="확대 이미지"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "12px"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
