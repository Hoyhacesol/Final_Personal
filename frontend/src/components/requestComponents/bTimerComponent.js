import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const calculateTimeLeft = (endDate) => {
  if (!endDate) return { isUrgent: false, timeLeftStr: "마감 정보 없음" };

  const difference = +new Date(endDate) - +new Date();
  let timeLeftStr = "마감됨";
  let isUrgent = false;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    timeLeftStr = "";
    if (days > 0) timeLeftStr += `${days}일 `;
    if (hours > 0) timeLeftStr += `${hours}시간 `;
    if (minutes > 0) timeLeftStr += `${minutes}분 `;
    if (seconds > 0) timeLeftStr += `${seconds}초`;
    if (timeLeftStr.trim() === '') timeLeftStr = '0초';

    isUrgent = difference < (1000 * 60 * 60 * 12);
  }

  return { isUrgent, timeLeftStr };
};

const OrderItem = ({ quote, type, onReviewClick }) => {
  const endDate = useMemo(() => {
    if (!quote.oregdate || type !== 'active') return null;
    const date = new Date(quote.oregdate);
    date.setDate(date.getDate() + 7);
    return date;
  }, [quote.oregdate, type]);

  const [timeInfo, setTimeInfo] = useState(() => calculateTimeLeft(endDate));

  useEffect(() => {
    if (type !== 'active' || !endDate) return;

    const timer = setInterval(() => {
      setTimeInfo(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, type]);

  const displayDate = quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';

  return (
    <li className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <Link to={`/request/read/${quote.ono}`} className="flex-1 mb-2 sm:mb-0 clickMyComponent" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="font-semibold text-lg">{quote.otitle || '제목 null'}</span>
        <div className="text-sm text-gray-600">
          {quote.playType} | {quote.region || '지역 null'} | {displayDate} {quote.rentalTime || '시간 null'} | {quote.person ? `${quote.person}명` : '인원 null'}
        </div>
        {type === 'active' && (
          <div className={`text-sm mt-1 ${timeInfo.isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
            {timeInfo.timeLeftStr}
          </div>
        )}
      </Link>

      <div className="flex-shrink-0">
        {type === 'closed' && quote.finished === 11 && (
          <button onClick={() => onReviewClick(quote)} className={`rq-review-default-btn ${quote.hasReview ? 'rq-review-modify-btn' : ''}`}>
            {quote.hasReview ? '리뷰 수정' : '리뷰 작성'}
          </button>
        )}
      </div>
    </li>
  );
};

export default React.memo(OrderItem);