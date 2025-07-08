// src/pages/MyPage/OrderList.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModal';
import ReviewModModal from '../../components/requestComponents/ReviewModModal';
import useBodyScrollLock from '../../hooks/useBodyScrollLock'; // 스크롤 방지 훅 임포트
import OrderItem from './bTimerComponent';
import { postReview, getReview, updateReview } from "../../api/reviewApi";
import { FaPencilAlt } from 'react-icons/fa';

const List = ({ title, quotes, type, onReviewUpdate, onFinish }) => {
  const navigate = useNavigate();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [initialReviewData, setInitialReviewData] = useState(null);

  // 모달 상태에 따라 스크롤 방지 훅 호출
  useBodyScrollLock(isCreateModalOpen || isModifyModalOpen);

  // const openModal = (quote) => {
  //   setSelectedQuote(quote);
  //   setIsModalOpen(true);
  // };
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedQuote(null);
  // };



  const handleReviewClick = async (quote) => {
        console.log(`[리뷰 버튼 클릭] ono: ${quote.ono}, hasReview: ${quote.hasReview}`);
    setSelectedQuote(quote);
    if (quote.hasReview) {
      // 수정 모드: 기존 리뷰 데이터 가져와서 수정 모달 열기
      const reviewData = await getReview(quote.ono);
      setInitialReviewData(reviewData);
      setIsModifyModalOpen(true);
    } else {
      // 생성 모드: 생성 모달 열기
      setIsCreateModalOpen(true);
    }
  };
  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setIsModifyModalOpen(false);
    setSelectedQuote(null);
    setInitialReviewData(null);
  };


  return (
    <div className='request-body omypMain'>
      <section className="mt-6">
        <div className="rq-flex-container-panel-title">
          <h2 className="font-bold text-lg">{title}</h2>
          {title === '진행 견적' && (
            <button
              onClick={() => navigate('/request/write')}
              className="rq-create-btn"
              aria-label="견적 작성"
            >
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
                onReviewClick={handleReviewClick}
                onFinish={onFinish}
              />
            ))
          ) : (
            <li className="bg-gray-50 p-3 rounded text-gray-500 text-center">
              {title}이(가) 없습니다.
            </li>
          )}
        </ul>
      </section>

      {/* ReviewModal */}
      {/* <ReviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mno={selectedQuote?.mno}
        onSubmit={({ rating, comment }) => {
          postReview({
            ono: selectedQuote.ono,
            mno: selectedQuote.mno,
            rating,
            comment
          })
            .then(() => {
              alert("리뷰가 등록되었습니다!");
              closeModal();
            })
            .catch(err => {
              console.error(err);
              alert("리뷰 등록에 실패했습니다.");
            });
        }}
      /> */}
      {/* 리뷰 생성 모달 */}
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
            // alert("리뷰가 등록되었습니다!");
            closeAllModals();
            if (onReviewUpdate) onReviewUpdate();
          } catch (err) {
            console.error(err);
            alert("리뷰 등록에 실패했습니다.");
          }
        }}
      />

      {/* 리뷰 수정 모달 */}
      <ReviewModModal
        isOpen={isModifyModalOpen}
        onClose={closeAllModals}
        initialData={initialReviewData}
        onSubmit={async ({ rating, rcontent }) => {
          try {
            await updateReview({ ono: selectedQuote.ono, rating, rcontent });
            // alert("리뷰가 수정되었습니다!");
            closeAllModals();
            if (onReviewUpdate) onReviewUpdate();
          } catch (err) {
            console.error(err);
            alert("리뷰 수정에 실패했습니다.");
          }
        }}
      />
    </div>
  );
};

const OrderList = { List };
export default OrderList;
