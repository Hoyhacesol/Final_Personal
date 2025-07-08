import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { getBizDetail, updateBiz } from "../../api/BizApi";
import { getOrderDetail } from "../../api/RequestApi";
import {
  FaRunning, FaMapMarkerAlt, FaToolbox, FaRegCalendarAlt, FaUsers, FaAlignLeft
} from "react-icons/fa";
import titleImage from "../../assets/img/title.png";
import "../../css/Sharesheet.css"
import styles from "../../css/BizModifyPage.module.css";

const BizModifyPage = () => {
  const { ono } = useParams();
  const { user, loading } = useAuth();
  const [bcontent, setBcontent] = useState("");
  const [banswer, setBanswer] = useState("");
  const [price, setPrice] = useState("");
  const [order, setOrder] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isValidPrice = /^\d+$/.test(price.replace(/,/g, ""));
  const isValid = bcontent.trim() && banswer.trim() && isValidPrice;

  useEffect(() => {
    if (loading) return;

    const runChecksAndFetch = async () => {
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      if (user.role !== "SELLER") {
        alert("업체 회원만 접근할 수 있습니다.");
        navigate("/error");
        return;
      }

      try {
        const [biz, order] = await Promise.all([
          getBizDetail(ono),
          getOrderDetail(ono)
        ]);

       // 🚫 finished !== 0일 경우 수정 차단
      if (order.finished !== 0) {
        alert("마감된 요청에는 입찰을 수정할 수 없습니다.");
        navigate(`/request/read/${ono}`);
        return;
      }

        setBcontent(biz.bcontent || "");
        setBanswer(biz.banswer || "");
        setPrice(biz.price ? biz.price.toLocaleString() : "");
        setOrder(order);
        setIsAllowed(true);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        alert("정보를 불러올 수 없습니다.");
        navigate(`/request/read/${ono}`);
      }
    };

    runChecksAndFetch();
  }, [user, loading, ono, navigate]);

  if (loading || !isAllowed) return null;

  const formatToNumber = (value) => value.replace(/[^0-9]/g, "");
  const formatWithComma = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const handlePriceChange = (e) => {
    const raw = formatToNumber(e.target.value);
    setPrice(formatWithComma(raw));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("수정한 입찰 내용을 저장하시겠습니까?");
    if (!confirmed) return;

    const payload = {
      ono: parseInt(ono, 10),
      price: parseInt(price.replace(/,/g, ""), 10),
      bcontent,
      banswer
    };

    try {
      await updateBiz(payload);
      alert("입찰 제안이 수정되었습니다.");
      navigate(`/request/read/${ono}`);
    } catch (err) {
      alert("수정 실패");
      console.error(err);
    }
  };

  return (
    <div className={styles["biz_register_page"]}>
      <div
        className={styles["biz_title_bg"]}
        style={{ backgroundImage: `url(${titleImage})` }}
      ></div>

      <div className={styles["biz_title_overlay"]}>
        <div className={styles["biz_title_container"]}>
          <h1>입찰 제안 수정</h1>
          <p>등록한 제안을 수정하고 다시 저장할 수 있어요.</p>
        </div>

        <div className={styles["biz_content_wrapper"]}>
          <div className={styles["request_box"]}>
            <h4>요청 정보</h4>
            {order ? (
              <>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaMapMarkerAlt /></span>
                  <span className={styles.label}>지역</span>
                  <span className={styles.value}>{order.region}</span>
                </div>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaRunning /></span>
                  <span className={styles.label}>종목</span>
                  <span className={styles.value}>{order.playType}</span>
                </div>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaToolbox /></span>
                  <span className={styles.label}>장비</span>
                  <span className={styles.value}>{order.rentalEquipment || '정보 없음'}</span>
                </div>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaRegCalendarAlt /></span>
                  <span className={styles.label}>대여일</span>
                  <span className={styles.value}>{order.rentalDate?.slice(0, 10)}</span>
                </div>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaUsers /></span>
                  <span className={styles.label}>인원</span>
                  <span className={styles.value}>{order.person || '미기입'}</span>
                </div>
                <div className={styles["info_item"]}>
                  <span className={styles.icon}><FaAlignLeft /></span>
                  <span className={styles.label}>요청 내용</span>
                  <span className={styles.value}>{order.ocontent || '내용 없음'}</span>
                </div>
              </>
            ) : (
              <p>견적 정보를 불러오는 중입니다...</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles["biz_form_box"]}>
            <h4>입찰 수정</h4>
            <label>상세정보</label>
            <textarea
              value={bcontent}
              onChange={(e) => setBcontent(e.target.value)}
              rows={4}
              required
            />

            <label>요청 답변</label>
            <textarea
              value={banswer}
              onChange={(e) => setBanswer(e.target.value)}
              rows={3}
              required
            />

            <label>제안 가격</label>
            <div className={styles["price_input_wrapper"]}>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="숫자만 입력"
                required
              />
              <span className={styles["price_unit"]}>원</span>
            </div>

            <button
              type="submit"
              className={`${styles["submit_btn"]} ${!isValid ? styles.disabled : ""}`}
              disabled={!isValid}
            >
              수정하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BizModifyPage;
