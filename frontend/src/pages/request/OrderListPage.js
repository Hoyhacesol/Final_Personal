import { useEffect, useState } from "react";
import { getOrderList } from "../../api/RequestApi";
import { useSearchParams } from "react-router-dom";
import { FaRunning,FaMapMarkerAlt,FaRegCalendarAlt,FaChevronDown, FaChevronUp } from "react-icons/fa";
import titleImage from "../../assets/img/title.png";
import AreaDropdown from "../../components/AreaDropdown";
import Pagination from "../../components/paging/Pagination";
import "../../css/OrderListPage.css";

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArea, setSelectedArea] = useState({ city: null, district: null });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [playTypeOpen, setPlayTypeOpen] = useState(false);

  const [filter, setFilter] = useState({
  city: "",
  district: "",
  playType: "",
});

useEffect(() => {
  setSearchParams({
    page: currentPage,
    city: selectedCity || "",       // 선택된 시/도
    district: selectedDistrict || "", // 선택된 구/군
    playType: filter.playType || ""
  });
}, [currentPage,filter]);  

useEffect(() => {
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const cityFromUrl = searchParams.get("city") || "";
  const districtFromUrl = searchParams.get("district") || "";
  const playTypeFromUrl = searchParams.get("playType") || "";

  setCurrentPage(pageFromUrl);
  setFilter({
    city: cityFromUrl,
    district: districtFromUrl,
    playType: playTypeFromUrl,
  });
  setInitialized(true);
}, [searchParams]);


useEffect(() => {
  if (!initialized) return;
  getOrderList(currentPage, 5, selectedArea.city, selectedArea.district, filter.playType)
    .then(data => {
      setOrders(data.dtoList);
      setPageData(data);
    })
    .catch(err => console.error("주문 목록 로딩 실패", err));
}, [currentPage, selectedArea, filter]);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handlePlayTypeChange = (type) => {
    setFilter(prev => ({ ...prev, playType: type }));
    setCurrentPage(1);
    setPlayTypeOpen(false);
  };

  return (
    <div className="order-title-container">
      
  <div
    className="order-title-bg"
    style={{ backgroundImage: `url(${titleImage})` }}
  ></div>

    <div className="order-title-overlay">
      <h2 className="order-title-overlay-main">견적 SELECT!</h2>
      <h3 className="order-title-overlay-sub">견적 목록</h3>
      <p className="order-title-overlay-desc">원하는 견적을 제안해보세요!</p>

      <div className="order-box">
        <div className="order-box-header">
          <span className="order-box-title">견적 목록</span>

            <div className="playtype-dropdown-wrapper">
                <button
                  onClick={() => setPlayTypeOpen(prev => !prev)}
                  className="playtype-dropdown-button"
                >
                  {filter.playType || "종목"}{" "}
                  {playTypeOpen ? <FaChevronUp className="dropdown-arrow" /> : <FaChevronDown className="dropdown-arrow" />}
                </button>

                {playTypeOpen && (
                  <ul className="playtype-dropdown-list">
                    <li onClick={() => handlePlayTypeChange("")}>전체</li>
                    <li onClick={() => handlePlayTypeChange("축구")}>축구</li>
                    <li onClick={() => handlePlayTypeChange("풋살")}>풋살</li>
                  </ul>
                )}
              </div>
              

                      <AreaDropdown
                        city={selectedCity}
                        district={selectedDistrict}
                        onChange={({ city, district }) => {
                          setSelectedArea({ city, district });
                          setSelectedCity(city);         
                          setSelectedDistrict(district);
                          setFilter(prev => ({ ...prev, city, district }));  
                          setCurrentPage(1);
                        }}
                      />
        </div>
      

        <ul className="order-list">
          {orders.length === 0 ? (
            <li className="order-list-item empty">해당 지역의 견적이 없습니다.</li>
          ) : (
            orders.map((order) => (
              <li key={order.ono} className="order-list-item">
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
            ))
          )}
        </ul>


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
