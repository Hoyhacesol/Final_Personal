import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import OrderList from "../../components/requestComponents/bContentP10";
import Hero from "../../components/requestComponents/bHero";

// 견적리스트

const { List } = OrderList;

const OrderMyPage = () => {
  const [activeLists, setActiveLists] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 마감 처리 요청을 보낸 견적의 ono를 저장하는 Set (중복 요청 방지)
  const finishingOrdersRef = useRef(new Set()); 

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  // fetchMyOrders는 초기 로딩 및 필요 시 수동으로만 호출
  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/orders/my-orders', { withCredentials: true });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        navigate('/');
        alert("로그인이 필요합니다.");
        throw new Error("로그인하지 않았거나 응답 형식이 JSON이 아닙니다.");
      }

      const data = response.data;
      const { activeOrders, closedOrders, cancelledOrders } = data;

      const now = new Date();
      const initialActiveWithTime = (activeOrders ?? []).map((quote) => {
        const regDate = new Date(quote.oregdate);
        const deadline = new Date(regDate);
        deadline.setDate(regDate.getDate() + 7);
        deadline.setHours(regDate.getHours()); // 시간 정보 보존

        const timeLeft = deadline - now;
        
        let timeStr = "";
        let isUrgent = false;

        if (timeLeft <= 0) {
            timeStr = "마감";
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            // timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
            if (days > 0) timeStr += `${days}일 `;
            if (hours > 0) timeStr += `${hours}시간 `;
            if (minutes > 0) timeStr += `${minutes}분 `;
            if (seconds > 0) timeStr += `${seconds}초`;
            
            isUrgent = timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0;
        }

        return {
          ...quote,
          timeLeftStr: timeStr,
          isUrgent: isUrgent,
          rawTimeLeft: timeLeft // 남은 시간 원본 값 저장 (음수 여부 판단용)
        };
      });

      setActiveLists(initialActiveWithTime);
      setClosedOrders(closedOrders ?? []);
      setCancelledOrders(cancelledOrders ?? []);

    } catch (err) {
      setError("내 견적 목록을 불러오는 데 실패했습니다.");
      console.error("Error fetching my orders:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 첫 로딩 시 데이터 페치
  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // 남은 시간 업데이트 및 마감 처리 (Interval)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      // activeLists를 필터링하면서 timeLeft를 계산하고, 마감된 항목은 처리
      const nextActiveLists = []; // 다음 activeLists가 될 배열

      activeLists.forEach(quote => {
        const regDate = new Date(quote.oregdate);
        const deadline = new Date(regDate);
        deadline.setDate(regDate.getDate() + 7);
        deadline.setHours(regDate.getHours()); // 시간 정보 보존용

        const timeLeft = deadline - now;
        
        // 마감 처리 로직: timeLeft가 0 이하이고 아직 처리 요청을 보내지 않은 경우
        if (timeLeft <= 0 && !finishingOrdersRef.current.has(quote.ono)) {
          console.log(`견적 ${quote.ono} 마감! 서버에 PATCH 요청 보냄.`);
          finishingOrdersRef.current.add(quote.ono); // 요청 중인 ono 추가

          axios.patch(`/api/orders/finish/${quote.ono}`, {}, { withCredentials: true })
            .then(response => {
              console.log(`견적 ${quote.ono} 마감 처리 성공:`, response.data);
              // 성공적으로 마감 처리되면 클라이언트 상태 즉시 업데이트
              setClosedOrders(prevClosed => [...prevClosed, { ...quote, timeLeftStr: "마감됨", isUrgent: false }]); // 마감된 견적을 닫힌 목록에 추가
            })
            .catch(err => {
              console.error(`견적 ${quote.ono} 마감 처리 실패:`, err);
              if (err.response) {
                console.error("서버 응답 데이터:", err.response.data);
                console.error("서버 응답 상태 코드:", err.response.status);
              }
            })
            .finally(() => {
              finishingOrdersRef.current.delete(quote.ono); // 요청 완료되었으니 Set에서 제거 (성공/실패 무관)
            });
          
          // 아직 마감되지 않은 견적
        } else if (timeLeft > 0) { 
            let timeStr = "";
            let isUrgent = false;

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            // timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
            if (days > 0) timeStr += `${days}일 `;
            if (hours > 0) timeStr += `${hours}시간 `;
            if (minutes > 0) timeStr += `${minutes}분 `;
            if (seconds > 0) timeStr += `${seconds}초`;

            // 모두 0일 경우 기본값 설정
            if (timeStr.trim() === '') {
              timeStr = '0초';
            }

            isUrgent = timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0;

            // 업데이트된 정보를 가진 견적을 다음 activeLists에 추가
            nextActiveLists.push({
                ...quote,
                timeLeftStr: timeStr,
                isUrgent: isUrgent,
                rawTimeLeft: timeLeft
            });
        }
      });

      // 최종적으로 activeLists 상태 업데이트
      setActiveLists(nextActiveLists);

    }, 1000); // 1초마다 갱신

    return () => clearInterval(interval); // 언마운트 시 정리
  }, [activeLists, closedOrders]); // activeLists와 closedOrders가 바뀔 때마다 타이머 재설정

  // 로딩 및 에러 메시지
  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <>
        <Hero {...myPageHero} />
        {activeLists && activeLists.length > 0 ? (
            <List title="진행 견적" quotes={activeLists} type="active"/>
        ) : (
            <div className="mt-6 text-gray-500">현재 진행 중인 견적이 없습니다.</div>
        )}
        <List title="마감 견적" quotes={closedOrders} type="closed" />
        <List title="취소 견적" quotes={cancelledOrders} type="cancelled" />
    </>
  );
};

export default OrderMyPage;