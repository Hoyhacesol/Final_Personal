import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";



// 견적 상세보기
const BContentP11 = ({ quote, companies }) => {
  const navigate = useNavigate();
  const { ono } = useParams(); // URL 파라미터 (견적 ID)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);


  const handleModifyClick = () => {
    navigate(`/request/modify/${ono}`); // 수정 페이지로 이동
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
      {/* 견적 제목 및 요약 */}
      <div className="mb-4 border-b pb-4">
        <div className="text-sm text-gray-600">현재 견적</div>
        <div className="font-bold text-lg mt-1">{quote.title}</div>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
          <div>{quote.location}</div>
          <div>{quote.date} {quote.timeDesc}</div>
        </div>
        <div className="text-red-500 font-semibold mt-2">
          마감 임박! {quote.timeLeft} 남았어요!
        </div>
      </div>

      {/* 견적 제안 리스트 */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">견적 제안</div>
        <div className="grid grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`border rounded p-3 cursor-pointer transition ${
                selectedCompanyId === company.id ? "border-blue-500 border-2 shadow-md" : ""
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
      <div className="flex justify-between mt-6">
        <button
          onClick={handleModifyClick}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          견적 요청 수정
        </button>
        <button
          onClick={handleConfirmClick}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          선택된 업체 확정
        </button>
      </div>
    </div>
  );
};

export default BContentP11;