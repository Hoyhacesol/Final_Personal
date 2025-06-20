// 견적 신청
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import axios from 'axios'; // axios 임포트

import BContentP08 from "../../components/requestComponents/bContentP08";
import Hero from "../../components/requestComponents/bHero";

  const createHero = {
    mainTitle: "나의 견적",
    subTitle: "클릭하고 KICK-OFF",
    notion: "장소? 장비? 걱정없이!"
  };


const OrderCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sport: '축구',
    rental: '필요해요', // 기본값 설정
    rentalItems: '',
    region: '',
    datetime: null,
    timeDetail: "",
    people: '',
    request: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newFormData = { ...formData, [name]: value };

    // '장비 대여 여부'가 '필요없어요'로 변경되었을 때, 관련 필드 비우기
    if (name === 'rental' && value === '필요없어요') {
        newFormData.rentalItems = '';
        newFormData.detail = '';
    }
    
    // datetime 필드가 DatePicker에서 넘어오는 경우 Date 객체 처리
    if (name === 'datetime' && value instanceof Date) {
        newFormData.datetime = value;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formData };
      if (formData.rental === '필요없어요') {
        dataToSend.rentalItems = '';
        dataToSend.detail = '';
      }
      delete dataToSend.rental; // 백엔드에 rental 필드를 보내지 않으므로 삭제

      console.log(dataToSend);
      const response = await axios.post('/api/orders', dataToSend);
      const newOno = response.data.ono; // 백엔드에서 생성된 ono를 반환한다고 가정

      alert("견적 생성 성공");
      navigate(`/request/read/${newOno}`); // 생성 후 상세 페이지로 이동
    } catch (err) {
      alert("견적 생성 실패");
      console.error("Error creating order:", err);
    }
  };

  return (
    <>
      <div className="bg-cover bg-center min-h-screen pt-12">
        <Hero {...createHero} />
        <BContentP08
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default OrderCreatePage;
