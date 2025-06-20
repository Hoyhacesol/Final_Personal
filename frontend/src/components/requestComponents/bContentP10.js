// 마이페이지(견적목록)
import React from 'react';
import { Link } from 'react-router-dom';

// const Active = ({ title, location, date, isUrgent, timeLeft }) => (
//   <div className="border p-4 rounded shadow bg-white">
//     <div className="font-semibold">{title}</div>
//     <div className="text-sm text-gray-600">{location}</div>
//     <div className="text-sm">날짜:{date} 시간:</div>
//     {isUrgent && <div className="text-red-600">마감 임박 {timeLeft} 남았어요!</div>}
//   </div>
// );

// const List = ({ title, quotes, type }) => (
//   <section className="mt-6">
//     <h2 className="font-bold text-lg mb-2">{title}</h2>
//     <ul className="space-y-2">
//       {quotes.map((quote, ono) => (
//         <li key={ono} className="bg-gray-100 p-3 rounded flex justify-between items-center">
//           <span>{quote.title}</span>
//           {type === 'closed' && <button className="text-blue-600">리뷰작성</button>}
//           {type === 'cancelled' && (
//             <span className="text-gray-500 text-sm">취소된 견적은 7일 후 삭제됩니다.</span>
//           )}
//         </li>
//       ))}
//     </ul>
//   </section>
// );

// 객체로 묶어서 export

const List = ({ title, quotes, type }) => ( 
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
        const displayTime = quote.rentalTime ? quote.rentalTime : '시간 null';
        const displayPeople = quote.person ? `${quote.person}명` : '인원 null';
        const displayRegion = quote.olocation ? `${quote.olocation}` : '지역 null';

        //날짜 계산 <------------------------------------------------------오류 수정 중
        const regDateObj = new Date(quote.regdate); //base
        let endDateObj = new Date(quote.regdate);
        endDateObj = new Date(endDateObj.setDate(regDateObj.getDate() + 7)); //7일뒤. 시간은 00으로 초기화됨
        endDateObj.setHours(regDateObj.getHours()); // 원래 시간 설정

        const timeLeft = endDateObj - new Date(); //남은 시간 계산 (밀리초)
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeLeft % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;

        const isUrgent = timeLeft < (1000*60*60*12) ? true : false;  // 12시간 이하면 true
        let urgentStr = isUrgent===true?"True":"False";

        return (
          <li key={quote.ono || idx} className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"> 
            <div className="flex-1 mb-2 sm:mb-0">
              <span className="font-semibold text-lg">{quote.ocontent} 견적 (글번호: {quote.ono})</span>
              <div className="text-sm text-gray-600"> {displayRegion} | {displayDate} {displayTime} | {displayPeople} </div>
              {type === 'active' && ( <div className="text-red-600 text-sm mt-1">디버깅-남은시간 : {timeStr} | {urgentStr} </div> )}
              {/* {type === 'active' && isUrgent && ( <div className="text-red-600 text-sm mt-1">마감 임박 {timeStr} 남았어요!</div> )} */}
            </div>
            <div className="flex-shrink-0">
              {type === 'active' && (
                <Link to={`/request/read/${quote.ono}`}> 
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
                    견적 상세
                  </button>
                </Link>
              )}
              {type === 'closed' && (
              <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"> 리뷰 작성 </button>
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
);




const OrderList = {
  List,
};

export default OrderList;
