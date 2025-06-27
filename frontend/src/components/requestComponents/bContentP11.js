import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./requestDebugStyle.css";



// 견적 상세보기
const BContentP11 = ({ quote, companies }) => {
  const navigate = useNavigate();
  const { ono } = useParams(); // URL 파라미터 (견적 ID)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

// null 대비 매핑
  const displayOtitle = quote.otitle ? quote.otitle : '제목 null';
  const displayDate = 
    quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';
  const displayTime = quote.rentalTime ? quote.rentalTime : '시간 null';
  const displayPerson = quote.person ? `${quote.person}명` : '인원 null';
  const displayRegion = quote.region ? `${quote.region}` : '지역 null';
  const displayRentalEquipment = quote.rentalEquipment ? `${quote.rentalEquipment}` : '대여 장비 미신청';
  const displayOcontent = quote.ocontent ? `${quote.ocontent}` : '요청사항이 없어요';

  const handleModifyClick = () => {
    navigate(`/request/modify/${ono}`);
  };
  const handleDeleteClick = () => {
    axios.patch(`/api/orders/delete/${ono}`, { ono })
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
    navigate(`/request/list`);
  };
  const handleConfirmClick = async () => {
    if (!selectedCompanyId) {
      alert("업체를 선택해주세요.");
      return;
  }
    
    try {
      await axios.patch(`/api/orders/${ono}/select`, {
        companyId: selectedCompanyId,
      });
      alert("업체가 확정되었습니다!");
      navigate(`/request/list`);
    } catch (error) {
      console.error("업체 확정 오류:", error);
      alert("업체 확정에 실패했습니다.");
    }
  };

  

  return (
    <div className='request-body bg-cover bg-center'>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6
         bcontent-container">
        {/* 견적 제목 및 요약 */}
        <div className="mb-4 border-b pb-4   bcontent-summary">
          <div className="text-sm text-gray-600">현재 견적</div>
          <p>
            {quote.finished ? (
              <span style={{ color: 'red', fontWeight: 'bold' }}>마감됨</span>
            ) : (
              <span style={{ color: quote.isUrgent ? 'orange' : 'inherit' }}>진행중 : {quote.timeLeftStr}</span>
            )}
          </p>
          <div className="font-bold text-lg mt-1">{displayOtitle}</div>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
            <div>종목 : {quote.playType}</div>
            <div>지역📍 : {displayRegion}</div>
            <div>인원 : {displayPerson}</div>
            <div>대여 장비 목록 : {displayRentalEquipment}</div>
            <div>요청사항 : {displayOcontent}</div>
            <div>시간📆 : {displayDate} {displayTime}</div>
          </div>
          {quote.isUrgent && ( <div className="text-red-600 text-sm mt-1">마감 임박! {quote.timeLeftStr} 남았어요!</div> )}
        </div>

        {/* 견적 제안 리스트 */}
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">견적 제안</div>
          <div className="grid grid-cols-2 gap-4   company-grid">
            {companies.map((company) => (
              <div
                key={company.id}
                className={`border rounded p-3 cursor-pointer transition
                  company-card ${
                  selectedCompanyId === company.id ? "border-blue-500 border-2 shadow-md   selected" : ""
                }`}
                onClick={() => setSelectedCompanyId(company.id)}
              >
                <div className="text-sm font-semibold">
                  {company.name} | {company.location} | 리뷰 {company.reviewCount}건
                </div>
                <div className="text-sm mt-1 truncate">{company.description}</div>
                <div className="font-semibold mt-2">제시가 {company.price}원~</div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between mt-6   rq-button-group">
          <button
            onClick={handleModifyClick}
            className="md-button"
          >
            수정
          </button>
          <button
            onClick={handleDeleteClick}
            className="md-button"
          >
            삭제
          </button>
          <button
            onClick={handleConfirmClick}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800   confirm-button"
          >
            선택 업체 확정
          </button>
        </div>
      </div>
    </div>
  );
};

export default BContentP11;