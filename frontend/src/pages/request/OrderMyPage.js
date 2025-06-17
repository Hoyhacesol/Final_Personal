import { Link,Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios 임포트

import OrderList from "../../components/requestComponents/bContentP10";
import Hero from "../../components/requestComponents/bHero";

// 10-견적목록(마이페이지)

const { Active, List } = OrderList;

// const OrderMyPage = () => {
//   const activeList = {
//     title: "[장소+장비] 축구 종합 대여 요청",
//     location: "서울특별시 관악구/금천구/동작구/서초구",
//     date: "2025/07/09",
//     isUrgent: true,
//     timeLeft: "3:11:07"
//   };

//   const closedOrder = [
//     { title: "[장소] 풋살 장소 대여 요청" },
//     { title: "[장비] 축구 장비 대여 요청" }
//   ];

//   const cancelledOrder = [
//     { title: "[장비] 풋볼 장비 대여 요청" }
//   ];

//   const myPageHero = {
//     mainTitle: "나의 견적",
//     subTitle: "지금 KICK!",
//     notion: "이번에는 어디서 할까?"
//   };


//   return (
//     <div>
//       {/* <Header /> */}
//       <main className="max-w-4xl mx-auto mt-10 p-4">
//         <Hero {...myPageHero} />

//         <Active {...activeList} />
//         <List title="마감된 견적" quotes={closedOrder} type="closed" />
//         <List title="취소된 견적" quotes={cancelledOrder} type="cancelled" />
//       </main>
//       {/* <Footer /> */}
//     </div>
//   );
// };

const OrderMyPage = () => {
  const [activeList, setActiveList] = useState(null); // 활성 견적 상태
  const [closedOrders, setClosedOrders] = useState([]); // 마감된 견적 상태
  const [cancelledOrders, setCancelledOrders] = useState([]); // 취소된 견적 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        // 사용자 본인의 견적 목록을 가져오는 API 호출
        //  GET /api/orders/my-orders
        // 응답 데이터는 활성, 마감, 취소된 견적을 포함해야 함.
        const response = await axios.get('/api/orders/my-orders'); // 가상의 API 엔드포인트
        const data = response.data;

        // 백엔드 응답을 각 상태에 맞게 매핑
        setActiveList(data.activeOrder || null);
        setClosedOrders(data.closedOrders || []);
        setCancelledOrders(data.cancelledOrders || []);

      } catch (err) {
        setError("내 견적 목록을 불러오는 데 실패했습니다.");
        console.error("Error fetching my orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div>
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <Hero {...myPageHero} />

        {/* 활성 견적이 있을 경우에만 렌더링 */}
        {activeList && <Active {...activeList} />}
        <List title="마감된 견적" quotes={closedOrders} type="closed" />
        <List title="취소된 견적" quotes={cancelledOrders} type="cancelled" />
      </main>
    </div>
  );
};

export default OrderMyPage;
