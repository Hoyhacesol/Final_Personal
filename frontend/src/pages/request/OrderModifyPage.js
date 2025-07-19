// 견적 수정 페이지
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, updateOrder } from '../../api/orderApi';

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
    otitle: '',
    playType: '',
    rental: '', // 장비 대여 여부 (radio)
    rentalEquipment: {}, // 장비 대여 물품
    region: '',
    rentalDate: null,
    rentalTime: '',
    person: '',
    ocontent: '',
  });

  const [savedRentalEquipmentState, setSavedRentalEquipmentState] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 헬퍼 함수: "축구화&1,팀조끼&2,기타&~" 문자열을 객체로 파싱
  const parseRentalEquipmentString = (equipmentString) => {
    const parsed = {};
    if (equipmentString) {
      equipmentString.split(',').forEach(item => {
        if (item.startsWith('기타&')) {
          const value = item.substring(3); // '기타&' 다음부터 끝까지 가져옴
          parsed['기타'] = value;
        } else {
          // 다른 항목들은 마지막 '&'를 기준으로 분리
          const lastAmpersandIndex = item.lastIndexOf('&');
          if (lastAmpersandIndex !== -1) {
            const name = item.substring(0, lastAmpersandIndex);
            const quantityStr = item.substring(lastAmpersandIndex + 1);
            const quantity = parseInt(quantityStr);
            if (!isNaN(quantity)) {
              parsed[name] = quantity;
            } else {
              // 수량 파싱 실패 시, 해당 항목을 통째로 키로 사용 (오류 방지)
              parsed[item] = item;
            }
          } else {
            // '&'가 없는 경우 (예외 처리 또는 단독 항목)
            parsed[item] = item;
          }
        }
      });
    }
    return parsed;
  };


  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetail(ono); // 백엔드 API 호출
        const parsedRentalEquipment = parseRentalEquipmentString(data.rentalEquipment);

        // 백엔드에서 받은 데이터를 폼 데이터에 매핑 (null, undefined 예방)
        setFormData({
          otitle: data.otitle || '',
          playType: data.playType || '',
          rental: data.rentalEquipment || data.detail ? '필요해요' : '필요없어요',
          rentalEquipment: parsedRentalEquipment,
          region: data.region || '',
          rentalDate: data.rentalDate ? new Date(data.rentalDate) : null,
          rentalTime: data.rentalTime || '',
          person: data.person || '',
          ocontent: data.ocontent || '',
        });
        setSavedRentalEquipmentState(parsedRentalEquipment);
      } catch (err) {
        setError("정보를 불러오는 데 실패했습니다. 담당자에게 문의해주세요");
        console.error("Error fetching order data for modification:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ono) {
      fetchOrderData();
    }
  }, [ono]);
  
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
      } else {
        // 수량 100개 초과 검사
        const overMax = selectedItems.some(key => {
          if (key !== '기타') {
            return data.rentalEquipment[key] > 100;
          }
          return false;
        });
        if (overMax) newErrors.rentalEquipment = '장비 수량은 100개를 초과할 수 없습니다.';
      }
    }
    // 지역 유효성 검사 강화: 시/군/구 미선택 시 오류 발생
    const regionParts = data.region.trim().split(/\s+/);
    if (!data.region.trim()) {
      newErrors.region = '시/도를 선택해주세요.';
    } else if (regionParts.length < 2 && regionParts[0] !== "세종특별자치시") {
      // '세종특별자치시'가 아니면서 시/군/구가 없는 경우
      newErrors.region = '시/군/구를 선택해주세요.';
    }
    if (!data.rentalDate) newErrors.rentalDate = '날짜를 선택해주세요.';

    if (!data.rentalTime) {
      newErrors.rentalTime = '상세 시간을 입력해주세요.';
    } else if (data.rentalTime < "05:00" || data.rentalTime > "22:00") {
      newErrors.rentalTime = '시간은 오전 5시부터 오후 10시까지만 선택 가능합니다.';
    }

    if (!data.person || data.person <= 0) newErrors.person = '인원은 1명 이상이어야 합니다.';

    return newErrors;
  };

  const [errors, setErrors] = useState({});


  // 폼 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (name === 'rental' && newErrors.rentalEquipment) {
        delete newErrors.rentalEquipment;
      }
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
          rentalEquipment: savedRentalEquipmentState,
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
            newRentalEquipment[equipmentName] = equipmentName === '기타' ? '' : 1;
          } else {
            delete newRentalEquipment[equipmentName];
          }
        } else if (type === 'number' || (type === 'text' && equipmentName === '기타')) {
          newRentalEquipment[equipmentName] = equipmentName === '기타' ? value : parseInt(value) || 0;
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

  // 폼 제출 핸들러 (수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 제출 방지

    try {
      setFormSubmitted(true);
      const validationErrors = validate(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        // alert("입력 양식을 다시 확인해주세요.");
        return;
      }

      setIsSubmitting(true);
      // '필요없어요'를 선택했을 경우 rentalEquipment와 detail을 비운다.
      const dataToSend = { ...formData };
      if (formData.rental === '필요없어요') {
        dataToSend.rentalEquipment = '';
      }
      else {
        // rentalEquipment 객체를 문자열로 변환
        const equipmentString = Object.entries(dataToSend.rentalEquipment)
          .filter(([key, value]) => {
            if (key === '기타') {
              return value !== undefined && value.trim() !== '';
            }
            return typeof value === 'number' && value > 0;
          })
          .map(([key, value]) => {
            if (key === '기타') {
              return `기타&${value}`; // '기타&실제내용' 형태로 변환
            }
            return `${key}&${value}`; // 기존 '장비명&수량' 형태 유지
          })
          .join(',');
        dataToSend.rentalEquipment = equipmentString;
      }
      delete dataToSend.rental; // 백엔드에 rental 필드를 보내지 않으므로 삭제

      await updateOrder(ono, dataToSend); // PATCH 요청
      // alert("견적 정보가 성공적으로 수정되었습니다.");
      navigate(`/request/read/${ono}`, { replace: true }); // 수정 후 상세 페이지로 이동 (history를 대체)
    } catch (err) {
      alert("견적 수정에 실패했습니다.");
      console.error("Error updating order:", err);
    } finally {
      setIsSubmitting(false);
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
        formSubmitted={formSubmitted}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <div className='bottom-margin-setter'></div>
    </>
  );
};

export default OrderModifyPage;
