// src/pages/MyPage/OrderList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModal';
import { postReview } from "../../api/reviewApi";
import "./requestDebugStyle.css";

const List = ({ title, quotes, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const openModal = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  return (
    <div className='request-body omypMain'>
      <section className="mt-6">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        {type === 'cancelled' && (
          <span className="text-gray-500 text-sm">
            취소된 견적은 7일 후 삭제됩니다.
          </span>
        )}
        <ul className="space-y-2">
          {quotes && quotes.length > 0 ? (
            quotes.map((quote, idx) => {
              const displayDate = quote.rentalDate
                ? new Date(quote.rentalDate).toLocaleDateString('ko-KR')
                : '날짜 null';
              const displayOtitle = quote.otitle || '제목 null';
              const displayTime = quote.rentalTime || '시간 null';
              const displayPerson = quote.person
                ? `${quote.person}명`
                : '인원 null';
              const displayRegion = quote.region || '지역 null';

              return (
                <li
                  key={quote.ono || idx}
                  className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  {(type === 'active' || type === 'closed') ? (
                    <Link
                      to={`/request/read/${quote.ono}`}
                      className="flex-1 mb-2 sm:mb-0 clickMyComponent"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <span className="font-semibold text-lg">
                        {displayOtitle} (글번호: {quote.ono})
                      </span>
                      <div className="text-sm text-gray-600">
                        {quote.playType} | {displayRegion} | {displayDate} {displayTime} | {displayPerson}
                      </div>
                      {type === 'active' && quote.isUrgent && (
                        <div className="text-red-600 text-sm mt-1">
                          마감 임박! {quote.timeLeftStr} 남았어요!
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="flex-1 mb-2 sm:mb-0 clickMyComponent">
                      <span className="font-semibold text-lg">
                        {displayOtitle} (글번호: {quote.ono})
                      </span>
                      <div className="text-sm text-gray-600">
                        {quote.playType} | {displayRegion} | {displayDate} {displayTime} | {displayPerson}
                      </div>
                    </div>
                  )}

                  <div className="flex-shrink-0">
                    {type === 'closed' && (
                      <button
                        onClick={() => openModal(quote)}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                      >
                        리뷰 작성
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="bg-gray-50 p-3 rounded text-gray-500 text-center">
              {title}이(가) 없습니다.
            </li>
          )}
        </ul>
      </section>

      {/* ReviewModal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
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
      />
    </div>
  );
};

const OrderList = { List };
export default OrderList;
