// 마이페이지(견적목록)
import React from 'react';
import { Link } from 'react-router-dom';
import "./requestDebugStyle.css";

const handleReviewWriteClick = () => {
  alert("review 작성 모달");
  // navigate(`/`);
};

const List = ({ title, quotes, type }) => ( 
  <div className='request-body omypMain'>
    <section className="mt-6">
      <h2 className="font-bold text-lg mb-2">{title}</h2> 
      <div>
      {type === 'cancelled' && (
          <span className="text-gray-500 text-sm">취소된 견적은 7일 후 삭제됩니다.</span> 
        )}
      </div>
      <ul className="space-y-2">
        {/* quotes 배열이 존재하고 비어있지 않을 때만 맵핑  */}
        {quotes && quotes.length > 0 ? (quotes.map((quote, idx) => {
          const displayDate = 
            quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';
          const displayOtitle = quote.otitle ? quote.otitle : '제목 null';
          const displayTime = quote.rentalTime ? quote.rentalTime : '시간 null';
          const displayPerson = quote.person ? `${quote.person}명` : '인원 null';
          const displayRegion = quote.region ? `${quote.region}` : '지역 null';

          let urgentStr = quote.isUrgent===true?"True":"False"; //불리언 확인용


          return (
              <li key={quote.ono || idx} className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"> 
              {type === 'active' || type === 'closed' ? (
                <Link 
                  to={`/request/read/${quote.ono}`} 
                  className="flex-1 mb-2 sm:mb-0 clickMyComponent"
                  style={{ textDecoration: 'none', color: 'inherit' }} // Link의 기본 스타일 제거
                >
                  <span className="font-semibold text-lg">{displayOtitle} (글번호: {quote.ono})</span>
                  <div className="text-sm text-gray-600"> {displayRegion} | {displayDate} {displayTime} | {displayPerson} </div>
                  {type === 'active' && (
                    <div className="text-red-600 text-sm mt-1">디버깅-남은시간 : {quote.timeLeftStr}+{urgentStr}</div>
                  )}
                  {type === 'active' && quote.isUrgent && ( <div className="text-red-600 text-sm mt-1">마감 임박! {quote.timeLeftStr} 남았어요!</div> )}
                </Link>
              ) : ( // 일반 div 렌더링
                <div className="flex-1 mb-2 sm:mb-0 clickMyComponent">
                  <span className="font-semibold text-lg">{displayOtitle} (글번호: {quote.ono})</span>
                  <div className="text-sm text-gray-600"> {displayRegion} | {displayDate} {displayTime} | {displayPerson} </div>
                  {type === 'active' && (
                    <div className="text-red-600 text-sm mt-1">디버깅-남은시간 : {quote.timeLeftStr}+{urgentStr}</div>
                  )}
                  {type === 'active' && quote.isUrgent && ( <div className="text-red-600 text-sm mt-1">마감 임박! {quote.timeLeftStr} 남았어요!</div> )}
                </div>
              )}

              <div className="flex-shrink-0">
                {type === 'closed' && (
                <button onClick={handleReviewWriteClick}
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"> 리뷰 작성 </button>
                )}
              </div>
            </li>
          );
        })) : 
        (
        <li className="bg-gray-50 p-3 rounded text-gray-500 text-center"> {title}이(가) 없습니다. </li>
        )}
      </ul>
    </section>
  </div>
);




const OrderList = {
  List,
};

export default OrderList;
