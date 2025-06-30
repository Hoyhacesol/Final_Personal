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
  const [savedRentalEquipmentState, setSavedRentalEquipmentState] = useState({});
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
    if (data.rental === '필요해요') {
      const selectedItems = Object.keys(data.rentalEquipment).filter(key => {
        if (key === '기타') {
          return data.rentalEquipment[key] !== undefined && data.rentalEquipment[key].trim() !== '';
        }
        return typeof data.rentalEquipment[key] === 'number' && data.rentalEquipment[key] > 0;
      });

      if (selectedItems.length === 0) {
        newErrors.rentalEquipment = '대여할 장비를 1개 이상 선택하고 수량을 입력해주세요.';
      }
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
    const { name, value, type, checked } = e.target;

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      // 'rentalEquipment' 에러는 'rental' 필드가 변경될 때도 지워져야 합니다.
      if (name === 'rental' && newErrors.rentalEquipment) {
        delete newErrors.rentalEquipment;
      }
      // 다른 필드의 에러는 해당 필드 변경 시 지웁니다.
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });

    if (name === 'rental') {
      if (value === '필요해요') {
        setFormData(prev => ({
          ...prev,
          rental: value,
          rentalEquipment: savedRentalEquipmentState, // 저장된 값으로 복원
        }));
      } else { // '필요없어요'
        setSavedRentalEquipmentState(formData.rentalEquipment);
        setFormData(prev => ({
          ...prev,
          rental: value,
          rentalEquipment: {},
        }));
      }
    } 
    else if (name.startsWith('rentalEquipment-')) {
      const [prefix, equipmentName] = name.split('-');
      setFormData(prev => {
        const newRentalEquipment = { ...prev.rentalEquipment };
        if (type === 'checkbox') {
          if (checked) {
            // 체크박스 선택 시, 기본 수량 1 또는 '기타' 항목은 빈 문자열로 초기화
            newRentalEquipment[equipmentName] = equipmentName === '기타' ? '' : 1;
          } else {
            // 체크박스 해제 시, 해당 장비 제거
            delete newRentalEquipment[equipmentName];
          }
        } else if (type === 'number' || (type === 'text' && equipmentName === '기타')) {
          // 수량 입력 또는 '기타' 텍스트 입력
          newRentalEquipment[equipmentName] = equipmentName === '기타' ? value : parseInt(value) || 0; // 숫자가 아니면 0
          // 수량이 0이거나 '기타'가 비어있으면 체크박스가 해제된 것처럼 처리
          if (newRentalEquipment[equipmentName] === 0 || (equipmentName === '기타' && value.trim() === '')) {
            delete newRentalEquipment[equipmentName];
          }
        }
        setSavedRentalEquipmentState(newRentalEquipment); // 현재 상태를 바로 저장
        return { ...prev, rentalEquipment: newRentalEquipment };
      });
    } 
    else {
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
      if (dataToSend.rental === '필요없어요') {
        dataToSend.rentalEquipment = '';
      } else {
        const equipmentString = Object.entries(dataToSend.rentalEquipment)
          .filter(([key, value]) => {
            // '기타'는 값이 비어있지 않은 경우에만 포함
            if (key === '기타') {
              return value !== undefined && value.trim() !== '';
            }
            // 그 외 장비는 수량이 0보다 큰 경우에만 포함
            return typeof value === 'number' && value > 0;
          })
          .map(([key, value]) => `${key}&${value}`)
          .join(',');
        dataToSend.rentalEquipment = equipmentString;
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
