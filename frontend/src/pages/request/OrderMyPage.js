import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import Hero from "../../components/requestComponents/bHero";
import Pagination from '../../components/requestComponents/bPagination';
import ReviewModal from '../../components/ReviewModal';
import ReviewModModal from '../../components/requestComponents/ReviewModModal';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { postReview, getReview, updateReview } from "../../api/reviewApi";
import { FaPencilAlt } from 'react-icons/fa';

// calculateTimeLeft 헬퍼 함수
const calculateTimeLeft = (regDateStr) => {
  if (!regDateStr) {
    return { isFinished: true, isUrgent: false, timeLeftStr: "마감 정보 없음", rawTimeLeft: 0 };
  }

  const now = new Date();
  const regDate = new Date(regDateStr);
  const deadline = new Date(regDate);
  deadline.setDate(regDate.getDate() + 7);
  deadline.setHours(regDate.getHours());
  deadline.setMinutes(regDate.getMinutes());
  deadline.setSeconds(regDate.getSeconds());

  const difference = +deadline - +now;

  if (difference <= 0) {
    return { isFinished: true, isUrgent: false, timeLeftStr: "마감됨", rawTimeLeft: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  let timeLeftStr = "마감임박! ";
  if (days > 0) timeLeftStr += `${days}일 `;
  if (hours > 0) timeLeftStr += `${hours}시간 `;
  if (minutes > 0) timeLeftStr += `${minutes}분 `;
  timeLeftStr += `${seconds}초 남았어요.`;

  const isUrgent = difference < 1000 * 60 * 60 * 12;

  return { isFinished: false, isUrgent, timeLeftStr, rawTimeLeft: difference };
};

const OrderMyPage = () => {
  // --- States from OrderMyPage ---
  const [activeData, setActiveData] = useState(null);
  const [closedData, setClosedData] = useState(null);
  const [cancelledData, setCancelledData] = useState(null);

  const [activePage, setActivePage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- States for Modals (from bContentP10) ---
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [initialReviewData, setInitialReviewData] = useState(null);

  useBodyScrollLock(isCreateModalOpen || isModifyModalOpen);

  const isRedirecting = useRef(false);
  // 각 견적별 마감 처리 API 호출 중복 방지를 위한 Map
  const isFinishingRefMap = useRef(new Map());

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  // --- Functions from OrderMyPage ---
  const fetchPaginatedOrders = useCallback(async (status, page, setter) => {
    if (isRedirecting.current) return;

    try {
      const response = await axios.get(`/api/orders/my-orders/paginated`, {
        params: { status, page, size: 3 },
        withCredentials: true,
      });
      setter(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (!isRedirecting.current) {
          isRedirecting.current = true;
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

  // --- Data Fetching UseEffects ---
  useEffect(() => {
    fetchPaginatedOrders('active', activePage, setActiveData).finally(() => setLoading(false));
  }, [activePage, fetchPaginatedOrders]);

  useEffect(() => {
    fetchPaginatedOrders('closed', closedPage, setClosedData);
  }, [closedPage, fetchPaginatedOrders]);

  useEffect(() => {
    fetchPaginatedOrders('cancelled', cancelledPage, setCancelledData);
  }, [cancelledPage, fetchPaginatedOrders]);


useEffect(() => {
  if (!activeData || !activeData.dtoList || activeData.dtoList.length === 0) {
    return;
  }

  const interval = setInterval(() => {
    let requiresFullRefresh = false; // 하나의 플래그로 통합하여 전체 목록 갱신 여부 판단
    const updatedActiveList = activeData.dtoList.map(quote => {
      if (quote.finished !== 0) { // 이미 마감된 견적
        return { ...quote, ...calculateTimeLeft(quote.oregdate) };
      }

      const timeInfo = calculateTimeLeft(quote.oregdate);

      if (timeInfo.isFinished && !isFinishingRefMap.current.get(quote.ono)) {
        isFinishingRefMap.current.set(quote.ono, true);

        axios.patch(`/api/orders/finish/${quote.ono}`, {}, { withCredentials: true })
          .then(() => {
            requiresFullRefresh = true; // API 성공 시 전체 목록 갱신 필요
          })
          .catch(err => {
            console.error(`견적 ${quote.ono} 마감 처리 실패:`, err);
            if (err.response) {
              console.error("서버 응답 데이터:", err.response.data);
              console.error("서버 응답 상태 코드:", err.response.status);
            }
          })
          .finally(() => {
            isFinishingRefMap.current.delete(quote.ono); // 요청 완료 플래그 초기화
            // API 호출 완료 후에는 무조건 목록을 다시 불러오도록 함
            // 조건체크를 통해 비동기 작업이 끝난 후에 목록 갱신 유도
            if (requiresFullRefresh) { // 성공적으로 마감된 경우 갱신
                fetchPaginatedOrders('active', activePage, setActiveData);
                fetchPaginatedOrders('closed', closedPage, setClosedData);
            }
          });
        // API 요청이 나갔음을 즉시 UI에 반영
        return { ...quote, ...timeInfo, finished: 1 };
      }
      return { ...quote, ...timeInfo };
    });

    // 1초마다 시간 정보만 업데이트하여 UI 부드럽게 유지
    setActiveData(prev => ({ ...prev, dtoList: updatedActiveList }));
  }, 1000);

  return () => clearInterval(interval);
}, [activeData, activePage, closedPage, fetchPaginatedOrders]);


  // --- Functions for Modals (from bContentP10) ---
  const handleReviewClick = async (quote) => {
    setSelectedQuote(quote);
    if (quote.hasReview) {
      const reviewData = await getReview(quote.ono);
      setInitialReviewData(reviewData);
      setIsModifyModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setIsModifyModalOpen(false);
    setSelectedQuote(null);
    setInitialReviewData(null);
  };

  // --- OrderItem Component (Now a pure presentational component) ---
  const OrderItem = React.memo(({ quote, type, onReviewClick }) => {
    // calculateTimeLeft는 이제 OrderMyPage에서 계산하여 props로 전달됨
    // quote 객체에 timeLeftStr, isUrgent, isFinished, rawTimeLeft가 포함되어 있다고 가정
    const displayDate = quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';

    const QuoteContent = () => (
      <>
        <span className="font-semibold text-lg">{quote.otitle || '제목 null'}</span>
        <div className="text-sm text-gray-600">
          {quote.playType} | {quote.region || '지역 null'} | {displayDate} {quote.rentalTime || '시간 null'} | {quote.person ? `${quote.person}명` : '인원 null'}
        </div>
        {/* '진행 견적'이면서 '마감 임박' 상태일 때만 타이머를 표시합니다. */}
        {type === 'active' && quote.isUrgent && (
          <div className={`text-sm mt-1 ${!quote.isFinished ? 'text-red-600' : 'text-gray-500'}`}>
            {quote.timeLeftStr}
          </div>
        )}
      </>
    );

    return (
      <li className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {type === 'cancelled' ? (
          <div className="flex-1 mb-2 sm:mb-0">
            <QuoteContent />
          </div>
        ) : (
          <Link to={`/request/read/${quote.ono}`} className="flex-1 mb-2 sm:mb-0 clickMyComponent" style={{ textDecoration: 'none', color: 'inherit' }}>
            <QuoteContent />
          </Link>
        )}
        <div className="flex-shrink-0">
          {type === 'closed' && quote.finished === 11 && (
            <button onClick={() => onReviewClick(quote)} className={`rq-review-default-btn ${quote.hasReview ? 'rq-review-modify-btn' : ''}`}>
              {quote.hasReview ? '리뷰 수정' : '리뷰 작성'}
            </button>
          )}
        </div>
      </li>
    );
  });

  // --- OrderList Component (from bContentP10) ---
  const OrderList = ({ title, quotes, type, onReviewClick }) => ( // onFinish prop 제거
    <div className='request-body omypMain'>
      <section className="mt-6">
        <div className="rq-flex-container-panel-title">
          <h2 className="font-bold text-lg">{title}</h2>
          {title === '진행 견적' && (
            <button onClick={() => navigate('/request/write')} className="rq-create-btn" aria-label="견적 작성">
              <FaPencilAlt size={20} />
            </button>
          )}
        </div>
        {type === 'cancelled' && (
          <span className="text-gray-500 text-sm">
            취소된 견적은 3일 후 삭제됩니다.
          </span>
        )}
        <ul className="space-y-2">
          {quotes && quotes.length > 0 ? (
            quotes.map((quote) => (
              <OrderItem
                key={quote.ono}
                quote={quote}
                type={type}
                onReviewClick={onReviewClick}
                // onFinish prop은 이제 OrderItem에서 필요 없음
              />
            ))
          ) : (
            <li className="bg-gray-50 p-3 rounded text-gray-500 text-center">
              {title}이(가) 없습니다.
            </li>
          )}
        </ul>
      </section>
    </div>
  );

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error && !activeData) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <>
      <Hero {...myPageHero} />

      {/* 진행 견적 */}
      <OrderList title="진행 견적" quotes={activeData?.dtoList || []} type="active" /> {/* onFinish prop 제거 */}
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
      <OrderList title="마감 견적" quotes={closedData?.dtoList || []} type="closed" onReviewClick={handleReviewClick} />
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
      <OrderList title="취소 견적" quotes={cancelledData?.dtoList || []} type="cancelled" />
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

      {/* 리뷰 모달들 */}
      <ReviewModal
        isOpen={isCreateModalOpen}
        onClose={closeAllModals}
        mno={selectedQuote?.mno}
        onSubmit={async ({ rating, comment }) => {
          try {
            await postReview({
              ono: selectedQuote.ono,
              mno: selectedQuote.mno,
              rating,
              comment
            });
            closeAllModals();
            if (refreshClosedOrders) refreshClosedOrders();
          } catch (err) {
            console.error(err);
            alert("리뷰 등록에 실패했습니다.");
          }
        }}
      />

      <ReviewModModal
        isOpen={isModifyModalOpen}
        onClose={closeAllModals}
        initialData={initialReviewData}
        onSubmit={async ({ rating, rcontent }) => {
          try {
            await updateReview({ ono: selectedQuote.ono, rating, rcontent });
            closeAllModals();
            if (refreshClosedOrders) refreshClosedOrders();
          } catch (err) {
            console.error(err);
            alert("리뷰 수정에 실패했습니다.");
          }
        }}
      />

      <div className='bottom-margin-setter'></div>
    </>
  );
};

export default OrderMyPage;