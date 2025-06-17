// pages/request/OrderReadPage.js
import React, { useEffect, useState } from 'react'; // useEffect와 useState 임포트
import { useParams } from 'react-router-dom'; // useParams 임포트
import axios from 'axios'; // axios 임포트

import BContentP11 from "../../components/requestComponents/bContentP11";
import Hero from "../../components/requestComponents/bHero";

// const quoteDetail_ = {
//   title: "[장소+장비] 축구 종합 대여 요청",
//   location: "서울특별시 관악구/금천구/동작구/서초구",
//   date: "2025/07/09",
//   timeDesc: "시간협의가능",
//   timeLeft: "3:11:07"
// };

// const companies_ = [
//   { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "159,000" },
//   { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "150,000" },
//   { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "149,900" },
//   { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "149,000" }
// ];

const heroContent = {
  mainTitle: "견적 상세",
  subTitle: "지금 KICK!",
  notion: "KICK AUCTION이 중개합니다"
};

// const OrderReadPage = () => {
//   return (
//     <>
//       <div className="bg-cover bg-center min-h-screen pt-12">
//         <Hero {...heroContent} />
//         <BContentP11 quote={quoteDetail} companies={companies} />
//       </div>
//     </>
//   );
// };

const OrderReadPage = () => {
  const { ono } = useParams(); // URL에서 ono 값 가져오기
  const [quoteDetail, setQuoteDetail] = useState(null); // 견적 상세 정보 상태
  const [companies, setCompanies] = useState([]); // 업체 제안 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
        const response = await axios.get(`/api/orders/${ono}`); // 백엔드 API 호출
        const data = response.data;

        // 백엔드에서 받은 데이터를 프론트엔드 상태에 맞게 매핑
        // 백엔드 OrderController의 getOrder 메서드에서 보내는 필드명에 맞게 매핑.
        setQuoteDetail({
          title: data.sport, // playType -> sport로 매핑됨
          location: data.region, // olocation -> region으로 매핑됨
          date: data.datetime.split(' ')[0], // datetime에서 날짜 부분만 추출
          timeDesc: data.datetime.includes('|') ? data.datetime.split('|')[1].trim() : "시간협의가능", // datetime에서 시간 부분 추출
          // timeLeft는 백엔드에서 받지 않으므로 프론트에서 목업 유지 또는 로직 추가 필요
          timeLeft: "3:11:07" // 마감 임박은 프론트에서 자체적으로 계산하거나 백엔드에서 받아와야 함
                               // 현재는 백엔드에서 받지 않으므로 임시로 목업 유지
        });

        // 업체 목록 데이터는 백엔드 OrderController에서 직접 반환하지 않으므로,
        // 이 부분은 별도의 API가 있거나, 또는 getOrderDetails 응답에 포함되어야 함.
        // 현재 코드 상으로는 `companies` 데이터가 백엔드 응답에 포함되어 있지 않다.
        // 이 예시에서는 백엔드에서 `companies` 필드를 반환한다고 가정.
        // 만약 백엔드 응답에 `companies`가 없다면, 별도의 API 호출이 필요.
        setCompanies(data.companies || []); // 백엔드 응답에 companies 필드가 있다고 가정

      } catch (err) {
        setError("r : 견적 정보를 불러오는 데 실패했습니다.");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false); // 데이터 가져오기 완료 시 로딩 상태 false
      }
    };

    if (ono) { // ono 값이 있을 때만 API 호출
      fetchOrderDetails();
    }
  }, [ono]); // ono 값이 변경될 때마다 useEffect 재실행

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!quoteDetail) return <div className="text-center mt-20">견적 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="bg-cover bg-center min-h-screen pt-12">
        <Hero {...heroContent} />
        {/* quoteDetail이 로드된 후에만 BContentP11 렌더링 */}
        <BContentP11 quote={quoteDetail} companies={companies} />
      </div>
    </>
  );
};

export default OrderReadPage;
