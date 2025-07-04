import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import OrderList from "../../components/requestComponents/bContentP10";
import Hero from "../../components/requestComponents/bHero";
import Pagination from '../../components/requestComponents/bPagination';

// 견적리스트

const { List } = OrderList;

const OrderMyPage = () => {
  // 각 목록의 페이지네이션 데이터를 저장하는 상태
  const [activeData, setActiveData] = useState(null);
  const [closedData, setClosedData] = useState(null);
  const [cancelledData, setCancelledData] = useState(null);

  // 각 목록의 현재 페이지 번호를 관리하는 상태
  const [activePage, setActivePage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 401 에러 발생 시 중복 리디렉션을 방지하기 위한 플래그
  const isRedirecting = useRef(false);

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  // 상태(status)와 페이지(page)를 받아 해당 목록 데이터를 서버에 요청하는 함수
  const fetchPaginatedOrders = useCallback(async (status, page, setter) => {
    // 이미 리디렉션이 진행 중이면 추가 API 호출을 막습니다.
    if (isRedirecting.current) return;

    try {
      const response = await axios.get(`/api/orders/my-orders/paginated`, {
        params: { status, page, size: 3 }, // 페이지 당 3개씩 요청
        withCredentials: true,
      });
      setter(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // 여러 API 호출이 동시에 401 오류를 반환하더라도, 리디렉션은 한 번만 실행합니다.
        if (!isRedirecting.current) {
          isRedirecting.current = true; // 플래그를 true로 설정
          alert("로그인이 필요합니다.");
          navigate('/');
        }
      } else {
        setError(`'${status}' 목록을 불러오는 데 실패했습니다.`);
        console.error(`Error fetching ${status} orders:`, err);
      }
    }
  }, [navigate]);

  // 마감된 견적 목록을 새로고침하는 함수
  const refreshClosedOrders = useCallback(() => {
    fetchPaginatedOrders('closed', closedPage, setClosedData);
  }, [closedPage, fetchPaginatedOrders]);

  // '진행 견적' 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    // 페이지네이션 시 깜빡임 현상을 막기 위해 setLoading(true)를 호출하지 않습니다.
    // 최초 로딩은 loading 상태의 기본값(true)으로 처리하고,
    // 데이터 로딩이 끝나면 finally에서 setLoading(false)를 호출하여 로딩 화면을 제거합니다.
    fetchPaginatedOrders('active', activePage, setActiveData).finally(() => setLoading(false));
  }, [activePage, fetchPaginatedOrders]);

  // '마감 견적' 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchPaginatedOrders('closed', closedPage, setClosedData);
  }, [closedPage, fetchPaginatedOrders]);

  // '취소 견적' 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchPaginatedOrders('cancelled', cancelledPage, setCancelledData);
  }, [cancelledPage, fetchPaginatedOrders]);

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error && !activeData) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <>
        <Hero {...myPageHero} />

        {/* 진행 견적 */}
        <List title="진행 견적" quotes={activeData?.dtoList || []} type="active"/>
        {activeData && activeData.totalCount > 0 && (
          <Pagination
            current={activeData.currentPage}
            size={activeData.size}
            totalCount={activeData.totalCount}
            onPageChange={setActivePage}
            prev={activeData.prev}
            next={activeData.next}
          />
        )}

        {/* 마감 견적 */}
        <List title="마감 견적" quotes={closedData?.dtoList || []} type="closed" onReviewUpdate={refreshClosedOrders} />
        {closedData && closedData.totalCount > 0 && (
          <Pagination
            current={closedData.currentPage}
            size={closedData.size}
            totalCount={closedData.totalCount}
            onPageChange={setClosedPage}
            prev={closedData.prev}
            next={closedData.next}
          />
        )}

        {/* 취소 견적 */}
        <List title="취소 견적" quotes={cancelledData?.dtoList || []} type="cancelled" />
        {cancelledData && cancelledData.totalCount > 0 && (
          <Pagination
            current={cancelledData.currentPage}
            size={cancelledData.size}
            totalCount={cancelledData.totalCount}
            onPageChange={setCancelledPage}
            prev={cancelledData.prev}
            next={cancelledData.next}
          />
        )}

        <div className='bottom-margin-setter'></div>
    </>
  );
};

export default OrderMyPage;
