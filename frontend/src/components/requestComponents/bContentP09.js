import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// 오류 발생시 참고 -> tailwind처럼 처음 사용시 npm install react-datepicker & date-fns 두개 필요***
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import "./requestDebugStyle.css";

const formFields = {
  left: [
    {
      type: "select",
      label: "종목",
      options: ["축구", "풋살"],
      name: "playType"
    },
    {
      type: "radio",
      label: "장비 대여 여부",
      name: "rental",
      options: ["필요해요", "필요없어요"]
    },
    {
      type: "text",
      label: "대여할 장비 목록",
      name: "rentalEquipment",
      placeholder: "예: 축구화, 장갑, 조끼 등"
    }
  ],
  right: [
    {
      type: "text",
      label: "지역",
      name: "region",
      placeholder: "지역(시/도)을 입력해주세요",
      error: true
    },
    {
      type: "date",
      label: "날짜",
      name: "rentalDate"
    },
    {
      type: "text",
      label: "상세 시간",
      name: "rentalTime",
      placeholder: "시작 시간을 입력해주세요"
    },
    {
      type: "number",
      label: "인원",
      name: "person",
    },
    {
      type: "textarea",
      label: "요청사항",
      name: "ocontent",
      placeholder: "예: 인조잔디인가요? 주차장 있나요? 등"
    }
  ]
};

const renderField = (field ,value, handleChange, isReadOnly = false) => { 
  const currentPlaceholder = isReadOnly ? "" : field.placeholder;

  switch (field.type) {
    case "select":
      return (
        <select name={field.name} value={value} onChange={handleChange} 
        className="w-full border px-3 py-2 rounded">
          {field.options.map((option, idx) => (<option key={idx}>{option}</option>))}
        </select>
      );
    case "radio":
        return (
            <div className="flex gap-4 mt-1">
                {field.options.map((option, idx) => (
                    <label key={idx}>
                        <input
                            type="radio"
                            name={field.name}
                            value={option}
                            checked={value === option}
                            onChange={handleChange}
                        /> {option}
                    </label>
                ))}
            </div>
        );
    case "text":
      return (
        <input
          type="text"
          name={field.name}
          value={value ? value.toString() : ""}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${field.error ? "border-red-500" : ""}`}
          placeholder={currentPlaceholder}
          readOnly={isReadOnly}
        />
      );
    case "textarea":
      return (
        <textarea
          name={field.name}
          value={value}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="3"
          placeholder={currentPlaceholder}
          readOnly={isReadOnly}
        />
      );
    case "number":
      return (
          <input
              type="number"
              name={field.name}
              value={value}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              readOnly={isReadOnly}
              min="1"
              max="50"
              step="1"
          />
      );
    case "date":
      const today = new Date();
      const dayLater = new Date().setMonth(today.getMonth()+6); //6개월뒤까지 가능
      return (
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => handleChange({ target: { name: field.name, value: date } })}
          minDate={today}
          maxDate={dayLater}
          className="w-full border px-3 py-2 rounded"
          dateFormat="yyyy/MM/dd"
          placeholderText="날짜를 선택하세요"
        />
      );
    default:
      return null;
  }
};


const initialFields = {
  playType: "",
  rental: "",
  rentalEquipment: "",
  region: "",
  rentalDate: null, // DatePicker는 Date 객체 또는 null/undefined 사용
  rentalTime: "",
  person: "",
  ocontent: ""
};

const BContentP09 = () => {
  const navigate = useNavigate();
  const { ono } = useParams();
  const [formData, setFormData] = useState(initialFields);
  const [isRentalEquipmentReadOnly, setIsRentalEquipmentReadOnly] = useState(false);
  const [savedRentalEquipment, setSavedRentalEquipment] = useState('');

  useEffect(() => {
    axios.get(`/api/orders/${ono}`)
      .then((res) => {
        const fetchedData = res.data;
        
        // rentalEquipment 값에 따라 설정
        let defaultRental = "필요없어요"; // 기본값
        if (fetchedData.rentalEquipment && fetchedData.rentalEquipment.trim() !== "") {
          defaultRental = "필요해요";
        }

        setSavedRentalEquipment(fetchedData.rentalEquipment || '');


        // 받아온 데이터를 기반으로 formData 업데이트
        setFormData({
          // 모든 필드에 대해 null/undefined 방지 및 기본값 설정
          playType: fetchedData.playType || "",
          rental: defaultRental,
          rentalEquipment: fetchedData.rentalEquipment || "",
          region: fetchedData.region || "",
          rentalDate: fetchedData.rentalDate || null,
          rentalTime: fetchedData.rentalTime || "",
          person: fetchedData.person || "",
          ocontent: fetchedData.ocontent || "",
          // (initialFields에 없더라도 여기에 추가하면 formData에 포함됨)
          ono: fetchedData.ono,
          mno: fetchedData.mno,
          oregdate: fetchedData.oregdate,
          finished: fetchedData.finished,
        });
      })
      .catch((err) => console.error("견적 정보 불러오기 실패:", err));
  }, [ono]);

  useEffect(() => {
    if (formData.rental === "필요없어요") {
      setSavedRentalEquipment(formData.rentalEquipment); 
      setFormData((prev) => ({ ...prev, rentalEquipment: "" }));
      setIsRentalEquipmentReadOnly(true);
    } 

    else if (formData.rental === "필요해요") {
      setFormData((prev) => ({ ...prev, rentalEquipment: savedRentalEquipment }));
      setIsRentalEquipmentReadOnly(false);
    }
  }, [formData.rental, savedRentalEquipment]);


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 최신 값을 savedRentalEquipment에 반영
    if (name === 'rentalEquipment' && formData.rental === "필요해요") {
        setSavedRentalEquipment(value);
        // console.log("rentalEquipment 직접 변경 감지 & savedRentalEquipment 업데이트:", value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.patch(`/api/orders/${ono}`, formData)
      .then(() => {
        alert("수정 완료");
        navigate("/request");
      })
      .catch((err) => {
        alert("수정 실패");
        console.error(err);
      });
  };

  return (
    <div className='request-body bg-cover bg-center'>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {/* 왼쪽 폼 */}
        <div className="form-card">
          {formFields.left.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label >{field.label}</label>
              {
                field.name === 'rentalEquipment' ?
                  renderField(field, formData[field.name], handleChange, isRentalEquipmentReadOnly) :
                  renderField(field, formData[field.name], handleChange)
              }
            </div>
          ))}
        </div>
        {/* 오른쪽 폼 */}
        <div className="form-card">
          {formFields.right.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label className="block font-semibold mb-1">{field.label}</label>
              {renderField(field, formData[field.name], handleChange)}
            </div>
          ))}
          <div className="button-group">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button">
              취소
            </button>
            <button
              type="submit"
              className="submit-button">
              수정 완료
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BContentP09;