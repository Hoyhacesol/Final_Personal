import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';

import "./requestDebugStyle.css";



// 견적 상세보기
const BContentP11 = ({ quote, companies, isOwner, isSeller, hasSellerBid  }) => {
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
  let rentalEquipmentStr;
  if(quote.rentalEquipment){
    rentalEquipmentStr = quote.rentalEquipment.replaceAll("&", " ").replaceAll(",", ", ").replaceAll("기타","");
  }
  const displayRentalEquipment = rentalEquipmentStr ? rentalEquipmentStr : '대여 장비 미신청';
  // const displayRentalEquipment = quote.rentalEquipment ? `${quote.rentalEquipment}` : '대여 장비 미신청';
  
  const displayOcontent = quote.ocontent ? `${quote.ocontent}` : '요청사항이 없어요';

  const handleModifyClick = () => {
    if (quote.isUrgent) {
      alert("남은 시간이 12시간 이하인 견적 요청은 수정할 수 없습니다.");
      return;
    }
    navigate(`/request/modify/${ono}`);
  };
  const handleDeleteClick = () => {
    axios.patch(`/api/orders/delete/${ono}`, { ono })
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
    navigate(`/request/list`);
  };

    const handleCompanyCardClick = (company) => {
    // 현재 클릭된 업체의 ID (company.id)가 이미 선택된 상태인지 확인
    if (selectedCompanyId === company.seller.mno) {
      // 이미 선택된 업체라면, 선택 해제
      setSelectedCompanyId(null);
    } else {
      // 선택되지 않은 업체라면, 해당 업체 선택
      setSelectedCompanyId(company.seller.mno);
    }
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

      console.error("업체 확정 오류 :", error);
      const errorMessage = error.response?.data?.message || "업체 확정에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    }
  };

const handleSellerCreateClick = async () => {
  console.log("업체 : 견적 작성 클릭");
}
const handleSellerModifyClick = async () => {
  console.log("업체 : 견적 수정 클릭");
}
const handleSellerDeleteClick = async () => {
  console.log("업체 : 견적 삭제(포기,취소) 클릭");
}

  

  return (
    <div className='request-body bg-cover bg-center'>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6
         bcontent-container">
        {/* 견적 제목 및 요약 (상대 위치 지정) */}
        <div className="relative mb-4 border-b pb-4 bcontent-summary">
          {/* 뒤로가기 버튼 (절대 위치 지정) */}
          <button
            onClick={() => navigate(-1)}
            className="rq-undo-btn"
            aria-label="뒤로가기"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="text-sm text-gray-600">현재 견적</div>
          <p>
            {(() => {
              if (quote.finished === 11) {
                return <span style={{ color: 'green', fontWeight: 'bold' }}>확정을 완료했어요</span>;
              }
              if (quote.finished) {
                return <span style={{ color: 'red', fontWeight: 'bold' }}>마감되었어요</span>;
              }
              return (
                <span style={{ color: quote.isUrgent ? 'orange' : 'inherit' }}>
                  진행중이에요 : {quote.timeLeftStr}
                </span>
              );
            })()}
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
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <div
                  key={company.seller.mno}
                  className={`border rounded p-3 cursor-pointer transition company-card ${
                    selectedCompanyId === company.seller.mno
                      ? "border-blue-500 border-2 shadow-md selected"
                      : ""
                  }`}
                  onClick={() => handleCompanyCardClick(company)}
                >
                  <div className="text-sm font-semibold">
                    {company.seller.sname} | {company.seller.slocation} | 리뷰 {company.seller.hiredCount ?? '-'}건
                  </div>
                  <div className="text-sm mt-1 truncate">{company.biz.bcontent}</div>
                  <div className="text-sm mt-1 truncate">{company.biz.banswer}</div>
                  <div className="font-semibold mt-2">제시가 {(company.biz.price ?? 0).toLocaleString('ko-KR')}원~</div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                아직 제시한 업체가 없습니다.
              </div>
            )}
          </div>
        </div>


        {/* 하단 버튼 */}
        {isOwner && !(quote.finished===11) &&(
          <div className="flex justify-between mt-6   rq-button-group">
            <button onClick={handleModifyClick} className="md-button">
              수정
            </button>
            <button onClick={handleDeleteClick} className="md-button">
              삭제
            </button>
            <button onClick={handleConfirmClick} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800   confirm-button">
              선택 업체 확정
            </button>
          </div>
        )}
        {!isOwner && isSeller && !(quote.finished===11) && (
          hasSellerBid ? (
            <div className="flex justify-between mt-6 rq-button-group">
              <button onClick={handleSellerModifyClick} className="md-button">수정</button>
              <button onClick={handleSellerDeleteClick} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 confirm-button">포기</button>
            </div>
          ) : (
            <div className="mt-6">
            <Link
              to={`/request/${ono}/bizregister`}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 confirm-button block text-center"
            >
              입찰하기
            </Link>
          </div>
          )
        )}
      </div>
    </div>
  );
};

export default BContentP11;