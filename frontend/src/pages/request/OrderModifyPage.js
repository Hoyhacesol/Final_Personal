// 견적 수정 페이지
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import BContentP09 from "../../components/requestComponents/bContentP09";
import Hero from "../../components/requestComponents/bHero";

const modifyHero = {
  mainTitle: "견적 수정",
  subTitle: "INTERVAL",
  notion: "바뀐 일정? 바로 반영 가능!"
};

const OrderModifyPage = () => {
  const { ono } = useParams(); // URL에서 ono 값 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [formData, setFormData] = useState({ // 폼 데이터를 위한 상태
    playType: '',
    rental: '', // 장비 대여 여부 (radio)
    rentalEquipment: '', // 장비 대여 물품
    region: '',
    datetime: '',
    person: '',
    ocontent: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${ono}`); // 백엔드 API 호출
        const data = response.data;

        // 백엔드에서 받은 데이터를 폼 데이터에 매핑
        // OrderController의 getOrder 메서드가 반환하는 필드명에 맞게 매핑
        setFormData({
          playType: data.playType || '',
          rental: data.rentalEquipment || data.detail ? '필요해요' : '필요없어요', // 장비 정보가 있으면 '필요해요'로 설정
          rentalEquipment: data.rentalEquipment || '',
          region: data.region || '',
          datetime: data.datetime || '',
          person: data.person || '',
          ocontent: data.ocontent || '',
        });
      } catch (err) {
        setError("m : 견적 정보를 불러오는 데 실패했습니다.");
        console.error("Error fetching order data for modification:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ono) {
      fetchOrderData();
    }
  }, [ono]);

  // 폼 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러 (수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // '필요없어요'를 선택했을 경우 rentalEquipment와 detail을 비운다.
      const dataToSend = { ...formData };
      if (formData.rental === '필요없어요') {
        dataToSend.rentalEquipment = '';
      }
      delete dataToSend.rental; // 백엔드에 rental 필드를 보내지 않으므로 삭제

      await axios.patch(`/api/orders/${ono}`, dataToSend); // PATCH 요청
      alert("견적 정보가 성공적으로 수정되었습니다.");
      navigate(`/request/read/${ono}`); // 수정 후 상세 페이지로 이동
    } catch (err) {
      alert("견적 수정에 실패했습니다.");
      console.error("Error updating order:", err);
    }
  };

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!formData.playType) return <div className="text-center mt-20">견적 정보를 찾을 수 없습니다.</div>; // 데이터 로드 확인

  return (
    <>
      <Hero {...modifyHero} />
      <BContentP09
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default OrderModifyPage;
