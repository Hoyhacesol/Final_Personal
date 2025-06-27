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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedRentalEquipment, setSavedRentalEquipment] = useState('');
  const [formData, setFormData] = useState({
    otitle: '',
    region: '',
    playType: '축구',
    rental: '필요해요', // 기본값 설정
    rentalDate: null,
    rentalTime: "",
    person: '',
    rentalEquipment: {},
    ocontent: '',
  });


  const validate = (data) => {
    const newErrors = {};
    if (!data.otitle) newErrors.otitle = '제목을 입력해주세요.';
    if (!data.playType) newErrors.playType = '종목을 선택해주세요.';
    if (data.rental === '필요해요' && !data.rentalEquipment.trim()) {
      newErrors.rentalEquipment = '대여할 장비 목록을 입력해주세요.';
    }
    const regionParts = data.region.split(" ");
    if (!data.region || (regionParts.length < 2 && regionParts[0] !== "세종특별자치시")) {
      newErrors.region = '시/도와 시/군/구를 모두 선택해주세요.';
    }
    if (!data.rentalDate) newErrors.rentalDate = '날짜를 선택해주세요.';
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!data.rentalTime.trim()) {
      newErrors.rentalTime = '상세 시간을 입력해주세요.';
    } else if (!timeRegex.test(data.rentalTime)) {
      newErrors.rentalTime = '시간을 HH:MM 형식으로 입력해주세요.';
    }
    if (!data.person || data.person <= 0) newErrors.person = '인원은 1명 이상이어야 합니다.';
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 사용자가 필드를 수정하기 시작하면 해당 필드의 에러 메시지를 지웁니다.
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }


    if (name === 'rental') {
      if (value === '필요해요') {
        setFormData(prev => ({
          ...prev,
          rental: value,
          rentalEquipment: savedRentalEquipment,
        }));
      } else { // '필요없어요'
        setSavedRentalEquipment(formData.rentalEquipment);
        setFormData(prev => ({
          ...prev,
          rental: value,
          rentalEquipment: '',
        }));
      }
    } else if (name === 'rentalEquipment') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setSavedRentalEquipment(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      alert("입력 양식을 다시 확인해주세요.");
      return;
    }

    try {
      const dataToSend = { ...formData };
      if (formData.rental === '필요없어요') {
        dataToSend.rentalEquipment = '';
      }
      delete dataToSend.rental; // 백엔드에 rental 필드를 보내지 않으므로 삭제

      const response = await axios.post('/api/orders', dataToSend);
      const newOno = response.data.ono; // 백엔드에서 생성된 ono를 map으로 받아옴

      alert("견적 생성 성공");
      navigate(`/request/read/${newOno}`); // 생성 후 상세 페이지로 이동
    } catch (err) {
      alert("견적 생성 실패");
      console.error("Error creating order:", err);
    }
  };


  return (
    <>
      <Hero {...createHero} />
      <BContentP08
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formSubmitted={formSubmitted}
        errors={errors}
      />
    </>
  );
};

export default OrderCreatePage;
