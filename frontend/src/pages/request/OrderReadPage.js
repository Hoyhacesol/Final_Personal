// 상세보기
import React, { useEffect, useState, useRef } from 'react'; // useRef 추가
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useAuth } from "../../contexts/Authcontext";
import { useMemo } from 'react';
import axios from 'axios';
import { getSellerDetail } from '../../api/SellerApi'; // 업체 상세 정보 API
import { getImageUrl } from '../../api/UploadImageApi'; // 이미지 URL API

import BContentP11 from "../../components/requestComponents/bContentP11";
import useBodyScrollLock from '../../hooks/useBodyScrollLock'; // 스크롤 방지 훅 임포트
import Hero from "../../components/requestComponents/bHero";

const heroContent = {
  mainTitle: "견적 상세",
  subTitle: "지금 KICK!",
  notion: "KICK AUCTION이 중개합니다"
};

const OrderReadPage = () => {
  const { ono } = useParams();
  const [quoteDetail, setQuoteDetail] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSellerDetail, setSelectedSellerDetail] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // 모달 상태에 따라 스크롤 방지 훅 호출
  useBodyScrollLock(isModalOpen || !!enlargedImage);

  const isOwner = useMemo(() => {
    let checkVal;
    if (!quoteDetail || !user) return false;
    if(user.role === "UESR" || user.role === "USER"){ //Auth에 USER가 아니라 UESR로 들어가 있음. 오타? ********
      checkVal = true;
    }
    else if(user.role === "SELLER"){
      checkVal = true;
    }
    else{
      checkVal = false;
    }
    return checkVal && Number(user.mno) === Number(quoteDetail.mno);
  }, [user, quoteDetail]);

  const isSeller = useMemo(() => {
    return user?.role === "SELLER";
  }, [user]);

  const hasSellerBid = useMemo(() => {
    if (!isSeller || !companies || companies.length === 0 || !user) {
      return false;
    }
    // 현재 로그인한 판매자의 mno가 companies 리스트에 있는지 확인
    return companies.some(company => Number(company.seller.mno) === Number(user.mno));
  }, [isSeller, user, companies]);

 
  // MainPage.js와 동일한 모달 열기/닫기 로직
  const openCompanyModal = async (company) => { // 업체 전체 정보를 받도록 수정
    try {
      // 1. 기본 업체 상세 정보 API 호출 (MainPage와 동일)
      const detail = await getSellerDetail(company.seller.mno);

      // 2. API 결과와 현재 페이지의 제안 내용(biz)을 합침
      const modalData = {
        ...detail, // simage, phone, info, introContent 등
        biz: company.biz // price, bcontent, banswer 등
      };

      setSelectedSellerDetail(modalData);
      setEnlargedImage(null);
      setIsModalOpen(true);
    } catch (err) {
      console.error("업체 상세 정보 로딩 실패:", err);
      alert("업체 정보를 불러오는 데 실패했습니다.");
    }
  };

  const closeCompanyModal = () => {
    setIsModalOpen(false);
    setSelectedSellerDetail(null);
    setEnlargedImage(null);
  };

  // MainPage.js와 동일한 이미지 안전 처리 헬퍼
  const getSafeImage = (simage) => {
    if (!Array.isArray(simage) || simage.length === 0) {
      return "default/default.png";
    }
    const first = simage[0]?.trim();
    return (first && first !== "undefined") ? first : "default/default.png";
  };



  // 마감 처리 요청 중복 방지용 ref
  const isFinishingRef = useRef(false); 

  // 견적 상세 정보를 불러오는 함수
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // 백엔드 API 호출 - `/api/orders/${ono}`는 baseURL 또는 proxy를 통해 8080으로 연결됩니다.
      const response = await axios.get(`/api/orders/${ono}`, { withCredentials: true });
      const data = response.data;

      const now = new Date();
      const regDate = new Date(data.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours()); 
      deadline.setMinutes(regDate.getMinutes()); // 분, 초까지 정확하게 반영
      deadline.setSeconds(regDate.getSeconds());

      const timeLeft = deadline - now;
      let timeStr = "";
      let isUrgent = false;

      // 마감 여부 판단 (서버에서 받은 finished 상태와 클라이언트 계산 시간 비교)
      let currentFinishedStatus = data.finished; 
      if (timeLeft <= 0) {
        timeStr = "마감됨";
        currentFinishedStatus = true; // 시간이 지났으면 무조건 마감으로 간주
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        // timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
        if (days > 0) timeStr += `${days}일 `;
        if (hours > 0) timeStr += `${hours}시간 `;
        if (minutes > 0) timeStr += `${minutes}분 `;
        if (seconds > 0) timeStr += `${seconds}초`;
        
        isUrgent = timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0; // 12시간 미만 남았으면 긴급
      }

      setQuoteDetail({
        ...data, // 서버에서 받은 모든 데이터 포함
        timeLeftStr: timeStr,
        isUrgent: isUrgent,
        rawTimeLeft: timeLeft, // 남은 시간 원본 값
        finished: currentFinishedStatus, // 업데이트된 마감 상태
      });


      setCompanies(data.companies || []); 
    } catch (err) {
      setError("견적 정보를 불러오는 데 실패했습니다.");
      console.error("Error fetching order details:", err);
      // 에러 발생 시 navigate 처리 (예: 없는 견적 접근 시)
      if (err.response && err.response.status === 404) {
          navigate('/request'); // 견적 목록 페이지로 리다이렉트
          alert("존재하지 않는 견적입니다.");
      } else if (err.response && err.response.status === 401) {
          navigate('/'); // 로그인 페이지로 리다이렉트
          alert("로그인이 필요합니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 ono 변경 시 데이터 페치
  useEffect(() => {
    if (ono) {
      fetchOrderDetails();
    }
  }, [ono, navigate]); // navigate도 의존성 배열에 추가 (linter 경고 방지)

  // 남은 시간 업데이트 및 마감 처리 로직 (Interval)
  useEffect(() => {
    if (!quoteDetail || quoteDetail.finished) { // 이미 마감된 견적이면 타이머 불필요
      return; 
    }

    const interval = setInterval(async () => {
      const now = new Date();
      const regDate = new Date(quoteDetail.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours());
      deadline.setMinutes(regDate.getMinutes()); 
      deadline.setSeconds(regDate.getSeconds());

      const timeLeft = deadline - now;

      // 마감 처리 로직: 시간이 0 이하이고 아직 서버에 마감 요청을 보내지 않은 경우
      if (timeLeft <= 0 && !isFinishingRef.current) {
        isFinishingRef.current = true; // 요청 시작 플래그 설정
        
        try {
          // PATCH 요청은 withCredentials를 포함해야 CORS에러 안남.
          await axios.patch(`/api/orders/finish/${ono}`, {}, { withCredentials: true });
          
          // 성공 시, 클라이언트 상태의 finished 속성 업데이트
          setQuoteDetail(prev => ({
            ...prev,
            finished: true,
            timeLeftStr: "마감됨",
            isUrgent: false,
            rawTimeLeft: 0,
          }));
          clearInterval(interval); // 마감 처리 완료했으니 인터벌 중지
        } catch (err) {
          console.error(`견적 ${ono} 마감 처리 실패:`, err);
          if (err.response) {
            console.error("서버 응답 데이터:", err.response.data);
            console.error("서버 응답 상태 코드:", err.response.status);
          }
        } finally {
          isFinishingRef.current = false; // 요청 완료 플래그 초기화
        }
      } else if (timeLeft > 0) { // 아직 마감되지 않은 경우 시간 업데이트
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let timeStr = "";
        if (days > 0) timeStr += `${days}일 `;
        if (hours > 0) timeStr += `${hours}시간 `;
        if (minutes > 0) timeStr += `${minutes}분 `;
        if (seconds > 0) timeStr += `${seconds}초`;
        // 모두 0일 경우 기본값 설정
        if (timeStr.trim() === '') {
          timeStr = '0초';
        }

        setQuoteDetail((prev) => ({
          ...prev,
          timeLeftStr: timeStr,
          isUrgent: timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0,
          rawTimeLeft: timeLeft
        }));
      } else { // 시간이 0 이하인데 이미 마감 처리 되었거나 요청 중인 경우
        setQuoteDetail((prev) => ({
          ...prev,
          timeLeftStr: "마감됨",
          isUrgent: false,
          rawTimeLeft: 0
        }));
        clearInterval(interval); // 마감 상태면 인터벌 중지
      }
    }, 1000); // 1초마다 갱신

    // 컴포넌트 언마운트 시 또는 quoteDetail이 변경되어 인터벌이 재설정될 때 기존 인터벌 정리
    return () => clearInterval(interval);
  }, [quoteDetail, ono]); // quoteDetail과 ono가 바뀔 때마다 타이머 재설정

  // 로딩, 에러, 견적 없음 메시지
  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!quoteDetail) return <div className="text-center mt-20">견적 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <Hero {...heroContent} />
      <BContentP11
        quote={quoteDetail}
        companies={companies}
        isOwner={isOwner}
        isSeller={isSeller}
        hasSellerBid={hasSellerBid}
        onCompanyInfoClick={openCompanyModal}
      />

      {/* 업체 상세 정보 모달 (MainPage.js와 동일한 구조) */}
      {isModalOpen && selectedSellerDetail && (() => {
        const mainImg = getSafeImage(selectedSellerDetail.simage);
        return (
          <div className="rq-modal-overlay" onClick={closeCompanyModal}>
            <div className="rq-modal_content" onClick={e => e.stopPropagation()}>
              <div className="rq-modal_header">
                <h3>업체 상세 정보</h3>
                <button onClick={closeCompanyModal}>✕</button>
              </div>
              <div className="rq-modal_body">
                <div className="seller_top">
                  <div
                    className={`seller_image ${mainImg === "default/default.png" ? "non_clickable" : "clickable"}`}
                    onClick={() => {
                      if (mainImg !== "default/default.png") {
                        setEnlargedImage(getImageUrl(mainImg));
                      }
                    }}
                  >
                    <img src={getImageUrl(mainImg)} alt="대표 이미지" />
                  </div>
                  <div className="seller_info">
                    <strong>{selectedSellerDetail.sname}</strong><br />
                    연락처: {selectedSellerDetail.phone || "정보 없음"}<br />
                    주소: {selectedSellerDetail.slocation || "정보 없음"}
                  </div>
                  <div className="seller_inforeview">
                    <div>선정 횟수 : {selectedSellerDetail.hiredCount || 0}</div>
                    <div>리뷰 평점 : {selectedSellerDetail.avgRating || 0}</div>
                    <div>리뷰 개수 : {selectedSellerDetail.reviewCount || 0}</div>
                  </div>
                </div>
                <div className="seller_detail">
                  <p><strong>업체 정보</strong><br />{selectedSellerDetail.info || "정보 없음"}</p>
                  <p><strong>업체 소개</strong><br />{selectedSellerDetail.introContent || "소개 없음"}</p>
                  <hr className="rq-modal-divider" />
                  <p><strong>제안 내용</strong></p>
                  <p><strong>한 줄 소개 :</strong> {selectedSellerDetail.biz.bcontent}</p>
                  <p><strong>질문 답변 :</strong><br /><span className="preserve-lines">{selectedSellerDetail.biz.banswer}</span></p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 이미지 확대 모달 */}
      {enlargedImage && (
        <div className="rq-modal-overlay" onClick={closeCompanyModal}>
          <div className="rq-modal_content enlarged_image_modal" onClick={e => e.stopPropagation()}>
            <div className="rq-modal_header">
              <h3>이미지 확대 보기</h3>
              <button onClick={closeCompanyModal}>✕</button>
            </div>
            <div className="rq-modal_body" style={{ textAlign: "center" }}>
              <img src={enlargedImage} alt="확대 이미지" className="rq-enlarged_image_content" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default OrderReadPage;