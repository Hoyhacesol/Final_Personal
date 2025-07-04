import { useEffect, useState,useCallback,useRef } from "react";
import { useNavigate, useSearchParams} from "react-router-dom";
import { FaPhoneAlt, FaMapMarkerAlt,FaStar, FaStarHalfAlt, FaRegStar} from "react-icons/fa";
import { useAuth } from "../../contexts/Authcontext";
import {
  getSellerList,
  getSellerDetail,
  getSellerRegistered,
} from "../../api/SellerApi";
import { getImageUrl } from "../../api/UploadImageApi";
import {getReviewsBySeller} from "../../api/reviewApi"
import Pagination from "../../components/paging/Pagination";
import styles from "../../css/SellerListPage.module.css";


const SellerListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modal_open, setModalOpen] = useState(false);
  const [selected_seller, setSelectedSeller] = useState(null);
  const [slide_index, setSlideIndex] = useState(0);
  const [enlarged_image, setEnlargedImage] = useState(null);
  const [search_params, setSearchParams] = useSearchParams();
  const page_from_url = parseInt(search_params.get("page") || "1", 10);
  const [page, setPage] = useState(page_from_url);
  const [is_registered, setIsRegistered] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const observer = useRef();
  const reviewSectionRef = useRef(null);

  const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "날짜 오류";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

  const [seller_data, setSellerData] = useState({
    dtoList: [],
    pageList: [],
    currentPage: 1,
    totalPage: 0,
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
  });

  const get_safe_image = (simage) => {
    if (!Array.isArray(simage)) return "default/default.png";
    const first = simage[0]?.trim();
    if (!first || first === "undefined") return "default/default.png";
    return first;
  };

  useEffect(() => {
    if (user?.role !== "SELLER") return;
    const fetch_registration = async () => {
      const registered = await getSellerRegistered();
      setIsRegistered(registered);
      setChecked(true);
    };
    fetch_registration();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getSellerList(page, 12);
      setSellerData(data);
      setLoading(false);
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    setSearchParams({ page });
  }, [page]);

  useEffect(() => {
    const page_from_url = parseInt(search_params.get("page") || "1", 10);
    setPage(page_from_url);
  }, [search_params]);

  useEffect(() => {
  if (modal_open) {
    document.body.style.overflow = "hidden";  // 스크롤 잠금
  } else {
    document.body.style.overflow = "auto";    // 스크롤 복원
  }

  return () => {
    document.body.style.overflow = "auto";    // cleanup
  };
}, [modal_open]);


  const open_modal = async (mno) => {
  try {
    const detail = await getSellerDetail(mno);
    setSelectedSeller(detail);
    setSlideIndex(0);
    setModalOpen(true);
  } catch (err) {
    console.error("상세 불러오기 실패", err);
  }
};

const renderStars = (rating) => {
  const stars = [];
  const halfRating = rating / 2;
  for (let i = 1; i <= 5; i++) {
    if (halfRating >= i) {
      stars.push(<FaStar key={i} className={styles.star} />);
    } else if (halfRating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
    } else {
      stars.push(<FaRegStar key={i} className={styles.star} />);
    }
  }
  return stars;
};

const lastReviewElementRef = useCallback(
  node => {
    if (!showReviews || !hasMoreReviews) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting) {
        try {
          const data = await getReviewsBySeller(selected_seller.mno, reviewPage);
          setReviews(prev => [...prev, ...data.content]);
          setReviewPage(prev => prev + 1);
          setHasMoreReviews(!data.last);
        } catch (e) {
          console.error("리뷰 로딩 실패", e);
        }
      }
    });

    if (node) observer.current.observe(node);
  },
  [reviewPage, hasMoreReviews, showReviews, selected_seller]
);

    const close_modal = () => {
    setModalOpen(false);
    setSelectedSeller(null);
    setReviews([]);
    setReviewPage(0);
    setHasMoreReviews(true);
    setShowReviews(false);  
  };
  const go_to_register = () => navigate("/sellerlist/register");

  return (
    <div className={styles["page_wrapper"]}>
    <div className={styles["wrap_container"]}>
      <div className={styles["header"]}>
        <h2 className={styles["page_title"]}>업체 정보 한눈에 보기</h2>
        <p className={styles["page_subtitle"]}>
          고객 요청에 맞춰 입찰한 업체들을 빠르게 비교해보세요.
        </p>
        {user?.role === "SELLER" && checked && !is_registered && (
          <button className={styles["register_btn"]} onClick={go_to_register}>
            업체소개 등록
          </button>
        )}
      </div>

     {loading ? (
  <div className={styles["loading_wrapper"]}>
    <div className={styles["spinner"]}></div>
    <div>불러오는 중입니다...</div>
  </div>
) : seller_data.dtoList.length === 0 ? (
  <div className={styles["no_data"]}>등록된 업체가 없습니다.</div>
) : (
  <div className={styles["card_container"]}>
    {seller_data.dtoList.map((seller, idx) => (
      <div
        className={styles["card"]}
        key={idx}
        onClick={() => open_modal(seller.mno)}
      >
        <div className={styles["card_header"]}>
          <div className={styles["image"]}>
            <img
              src={getImageUrl(get_safe_image(seller.simage))}
              alt="대표"
            />
          </div>
          <div className={styles["count"]}>
            선정 횟수: {seller.hiredCount || 0}
          </div>
          <div className={styles["count"]}>
            리뷰 평점: {seller.avgRating || 0}
          </div>
        </div>
        <div className={styles["info"]}>
          <div className={styles["name"]}>
            {seller.sname || "업체명 없음"}
          </div>
          <div className={styles["address"]}>
            {seller.slocation || "주소 없음"}
          </div>
        </div>
        <button className={styles["detail_btn"]}>상세정보</button>
      </div>
    ))}
  </div>
)}

      <Pagination
        className={styles["fixed_pagination"]}
        current={seller_data.currentPage}
        pageList={seller_data.pageList}
        prev={seller_data.prev}
        next={seller_data.next}
        prevPage={seller_data.prevPage}
        nextPage={seller_data.nextPage}
        onPageChange={(pageNum) => {
          window.location.href = `/sellerlist?page=${pageNum}`
        }}
      />


      {modal_open && selected_seller && (() => {
        const simage = selected_seller.simage;
        const main_img = get_safe_image(simage);

        return (
          <div className={styles["modal_overlay"]} onClick={close_modal}>
            <div className={styles["modal_content"]} onClick={(e) => e.stopPropagation()}>
              <div className={styles["modal_header"]}>
                <h3>상세정보</h3>
                <button onClick={close_modal}>✕</button>
              </div>

              <div className={styles["modal_body"]}>
                <div className={styles["seller_top"]}>
                  <div
                    className={`${styles["seller_image"]} ${main_img === "default/default.png" ? styles["non_clickable"] : styles["clickable"]}`}
                    onClick={() => {
                      if (main_img !== "default/default.png") {
                        setEnlargedImage(getImageUrl(main_img));
                      }
                    }}
                  >
                    <img src={getImageUrl(main_img)} alt="대표" />
                  </div>
                  <div className={styles["seller_info"]}>
                    <strong>{selected_seller.sname || "업체명 없음"}</strong>
                    <br />
                    <FaPhoneAlt/> {selected_seller.phone || "정보 없음"}
                    <br />
                    <FaMapMarkerAlt/> {selected_seller.slocation || "정보 없음"}
                  </div>
                </div>

                <div className={styles["seller_inforeview"]}>
                  <div>선정 횟수 : {selected_seller.hiredCount || 0}</div>
                  <div>리뷰 평점 : {selected_seller.avgRating || 0}</div>
                  <div>리뷰 개수 : {selected_seller.reviewCount || 0}</div>
                </div>

                {Array.isArray(simage) && simage.length > 1 && simage.slice(1).some(img => img?.trim()) && (
                  <div className={styles["image_slider"]}>
                    {simage.length > 4 && slide_index > 0 && (
                      <button onClick={() => setSlideIndex((prev) => Math.max(prev - 3, 0))} className={styles["slider_button"]}>{"<"}</button>
                    )}

                    {simage.slice(1).slice(slide_index, slide_index + 3).filter(img => img?.trim()).map((img, i) => (
                      <div className={styles["img_box"]} key={i} onClick={() => setEnlargedImage(getImageUrl(img))}>
                        <img src={getImageUrl(img)} alt={`소개 ${i}`} />
                      </div>
                    ))}

                    {simage.length > 4 && slide_index + 3 < simage.length - 1 && (
                      <button onClick={() => setSlideIndex((prev) => prev + 3)} className={styles["slider_button"]}>{">"}</button>
                    )}
                  </div>
                )}

                <div className={styles["seller_detail"]}>
                    <p>
                      <strong>업체정보</strong>
                      <br />
                      {selected_seller.info || "정보 없음"}
                    </p>
                    <p>
                      <strong>업체소개</strong>
                      <br />
                      {selected_seller.introContent || "소개 없음"}
                    </p>
                  </div>

                  <hr />

                 <div className={styles["review_section"]} ref={reviewSectionRef}>
                    <button
                    className={styles["toggle_review_btn"]}
                    onClick={async () => {
                      if (!showReviews) {
                        setReviews([]);           // 초기화 추가
                        setReviewPage(0);         // 초기화 추가
                        const data = await getReviewsBySeller(selected_seller.mno, 0);
                        setReviews(data.content);
                        setReviewPage(1);
                        setHasMoreReviews(!data.last);
                      }
                      setShowReviews(prev => !prev);

                      setTimeout(() => {
                        reviewSectionRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
                      }, 100); // 모달 렌더링 이후 이동하도록 약간 지연
                    }}
                  >
                    {showReviews ? "리뷰 닫기" : "리뷰 보기"}
                  </button>


  {showReviews && (
          <div className={styles["review_scroll_container"]}>
            {Array.isArray(reviews) && reviews.length === 0 ? (
              <p>아직 리뷰가 없습니다.</p>
            ) : (
              <ul className={styles["review_list"]}>
                {reviews.map((rev, idx) => {
                  const isLast = idx === reviews.length - 1;
                  return (
                    <li
                      key={idx}
                      className={styles["review_item"]}
                      ref={isLast ? lastReviewElementRef : null}
                    >
                      <div className={styles["review_rating"]}>
                        {renderStars(rev.rating)} 
                      </div>
                      <div className={styles["review_author"]}>
                        작성자: {rev.username || "익명"}
                      </div>
                      <div className={styles["review_content"]}>{rev.rcontent}</div>
                      <div className={styles["review_date"]}>
                        {formatDate(rev.regDate)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>



              </div>
            </div>
          </div>
        );
      })()}

      {enlarged_image && (
        <div className={styles["modal_overlay"]} onClick={() => setEnlargedImage(null)}>
          <div className={styles["modal_content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal_header"]}>
              <h3>이미지 보기</h3>
              <button onClick={() => setEnlargedImage(null)}>✕</button>
            </div>
            <div className={styles["modal_body"]} style={{ textAlign: "center" }}>
              <img
                src={enlarged_image}
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
    </div>
  );
};

export default SellerListPage;