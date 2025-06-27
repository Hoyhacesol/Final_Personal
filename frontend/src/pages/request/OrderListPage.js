import { useEffect, useState } from "react";
import axios from "axios";
import titleImage from "../../assets/img/title.png";
import "../../css/OrderListPage.css";

function OrderListPage() {
  const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   axios.get("/api/request/list")
  //     .then(res => setOrders(res.data))
  //     .catch(err => console.error("주문 목록 로딩 실패", err));
  // }, []);

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
          <select className="order-select">
            <option>전체</option>
            <option>진행중</option>
            <option>완료</option>
          </select>
        </div>

        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.ono} className="order-list-item">
              <div className="order-item-content">
                <div>
                  <p className="order-item-title">요청사항 | {order.playType}</p>
                  <p className="order-item-sub">{order.olocation}, {order.rentalDate?.slice(0, 10)}</p>
                </div>
                <div className="order-item-date">
                  <p>작성일</p>
                  <p>{order.oregdate?.slice(0, 10)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="order-pagination">
          <button className="order-page-btn">Previous</button>
          <button className="order-page-btn">Next</button>
        </div>
      </div>
    </div>
  
</div>

  );
}

export default OrderListPage;
