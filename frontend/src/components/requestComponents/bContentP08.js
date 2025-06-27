// 견적 신청

import React, { useState, useEffect } from 'react';
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
          value={value?value:""}
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
          selected={value}
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

const BContentP08 = ({ formData, handleChange, handleSubmit }) => {
  const [isRentalEquipmentReadOnly, setIsRentalEquipmentReadOnly] = useState(false);

  useEffect(() => {
    if (formData.rental === '필요없어요') {
      setIsRentalEquipmentReadOnly(true);
    } 
    else {
      setIsRentalEquipmentReadOnly(false);
    }
  }, [formData.rental]); // formData.rental 값이 변경될 때마다 이 훅 실행

  return (
    <div className='request-body bg-cover bg-center'>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {/* 왼 */}
        <div className="form-card">
          {formFields.left.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label className="">{field.label}</label>
              {
                field.name === 'rentalEquipment' ?
                  renderField(field, formData[field.name], handleChange, isRentalEquipmentReadOnly) :
                  renderField(field, formData[field.name], handleChange)
              }
            </div>
          ))}
        </div>
        {/* 오 */}
        <div className="form-card">
          {formFields.right.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label className="">{field.label}</label>
              {renderField(field, formData[field.name], handleChange)}
            </div>
          ))}
          <button
            type="submit"
            className="full-submit-button">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BContentP08;