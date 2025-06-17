// 마이페이지(견적목록)
import React from 'react';

const Active = ({ title, location, date, isUrgent, timeLeft }) => (
  <div className="border p-4 rounded shadow bg-white">
    <div className="font-semibold">{title}</div>
    <div className="text-sm text-gray-600">{location}</div>
    <div className="text-sm">{date} 시간협의가능</div>
    {isUrgent && <div className="text-red-600">마감 임박 {timeLeft} 남았어요!</div>}
  </div>
);

const List = ({ title, quotes, type }) => (
  <section className="mt-6">
    <h2 className="font-bold text-lg mb-2">{title}</h2>
    <ul className="space-y-2">
      {quotes.map((quote, ono) => (
        <li key={ono} className="bg-gray-100 p-3 rounded flex justify-between items-center">
          <span>{quote.title}</span>
          {type === 'closed' && <button className="text-blue-600">리뷰작성</button>}
          {type === 'cancelled' && (
            <span className="text-gray-500 text-sm">취소된 견적은 7일 후 삭제됩니다.</span>
          )}
        </li>
      ))}
    </ul>
  </section>
);

// 객체로 묶어서 export
const OrderList = {
  Active,
  List,
};

export default OrderList;
