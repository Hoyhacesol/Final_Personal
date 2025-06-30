import { useEffect, useState } from "react";
import { useSearchParams,Link } from "react-router-dom";
import { getOrderList } from "../../api/RequestApi";
import AreaDropdown from "../../components/AreaDropdown";
import Pagination from "../../components/paging/Pagination";
import {
  FaRunning, FaMapMarkerAlt, FaRegCalendarAlt, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import titleImage from "../../assets/img/title.png";
import "../../css/OrderListPage.css";

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [playTypeOpen, setPlayTypeOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";
  const playType = searchParams.get("playType") || "";

  // 쿼리 기준으로 데이터 요청
  useEffect(() => {
    getOrderList(page, 5, city, district, playType)
      .then((data) => {
        setOrders(data.dtoList);
        setPageData(data);
      })
      .catch((err) => console.error("주문 목록 로딩 실패", err));
  }, [page, city, district, playType]);

  // 핸들러들
  const updateSearchParams = (params) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
  const params = new URLSearchParams(searchParams);
  params.set("page", newPage.toString());
  window.location.href = `/orderlist?${params.toString()}`; // 새로고침 방식
};
  const handlePlayTypeChange = (type) => {
    updateSearchParams({ playType: type, page: "1" });
    setPlayTypeOpen(false);
  };

  const handleAreaChange = ({ city, district }) => {
    updateSearchParams({ city, district, page: "1" });
  };

  return (
    <div className="order-title-container">
      <div className="order-title-bg" style={{ backgroundImage: `url(${titleImage})` }} />
      <div className="order-title-overlay">
        <h2 className="order-title-overlay-main">견적 SELECT!</h2>
        <p className="order-title-overlay-desc">원하는 견적을 입찰해보세요!</p>
        <div className="order-box">
        <div className="order-box-header">
        <span className="order-box-title">견적 목록</span>

        <div className="order-filter-wrapper">
          <div className="playtype-dropdown-wrapper">
            <button onClick={() => setPlayTypeOpen(prev => !prev)} className="playtype-dropdown-button">
              {playType || "종목"} {playTypeOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {playTypeOpen && (
              <ul className="playtype-dropdown-list">
                <li onClick={() => handlePlayTypeChange("")}>전체</li>
                <li onClick={() => handlePlayTypeChange("축구")}>축구</li>
                <li onClick={() => handlePlayTypeChange("풋살")}>풋살</li>
              </ul>
            )}
          </div>

          <div className="area-dropdown-wrapper">
            <AreaDropdown
              city={city}
              district={district}
              onChange={handleAreaChange}
            />
          </div>
        </div>
      </div>


          {/* 목록 */}
          <ul className="order-list">
            {orders.length === 0 ? (
              <li className="order-list-item empty">해당 지역의 견적이 없습니다.</li>
            ) : (
              orders.map((order) => (
                <Link to={`/request/read/${order.ono}`} key={order.ono}>
                <li
              className="order-list-item"
            >
                  <div className="order-card">
                    <div className="order-card-left">
                      <h4 className="order-title">{order.ocontent}</h4>
                      <p className="order-playtype"><FaRunning /> {order.playType}</p>
                      <p className="order-location"><FaMapMarkerAlt /> {order.olocation}</p>
                      <p className="order-date"><FaRegCalendarAlt /> {order.rentalDate?.slice(0, 10)}</p>
                    </div>
                    <div className="order-card-right">
                      <p className="order-regdate-label">작성일</p>
                      <p className="order-regdate">{order.oregdate?.slice(0, 10)}</p>
                    </div>
                  </div>
                </li>
                </Link>
              ))
            )}
          </ul>

          {/* 페이징 */}
          {pageData && (
            <Pagination
              current={pageData.currentPage}
              pageList={pageData.pageList}
              prev={pageData.prev}
              next={pageData.next}
              prevPage={pageData.prevPage}
              nextPage={pageData.nextPage}
              onPageChange={handlePageChange}
              className="order-pagination"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderListPage;
