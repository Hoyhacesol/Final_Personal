// 견적 신청

import React, { useState, useEffect } from 'react';
// 오류 발생시 참고 -> tailwind처럼 처음 사용시 npm install react-datepicker & date-fns 두개 필요***
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";


const formFields = {
  left: [
    {
      type: "select",
      label: "종목",
      options: ["축구", "풋살"],
      name: "sport"
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
      name: "rentalItems",
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
      name: "datetime"
    },
    {
      type: "text",
      label: "상세 시간",
      name: "timeDetail",
      placeholder: "시작 시간을 입력해주세요"
    },
    {
      type: "number",
      label: "인원",
      name: "people",
    },
    {
      type: "textarea",
      label: "요청사항",
      name: "request",
      placeholder: "예: 인조잔디인가요? 주차장 있나요? 등"
    }
  ]
};


const renderField = (field ,value, handleChange, isReadOnly = false) => { 
  const currentPlaceholder = isReadOnly ? "" : field.placeholder;

  switch (field.type) {
    case "select":
      return (
        <select name={field.name} value={value} onChange={handleChange} className="w-full border px-3 py-2 rounded">
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
          value={value}
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
    case "number": // <-- 새로운 case 추가
      return (
          <input
              type="number" // type을 "number"로 설정
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
      return (
        <DatePicker
          selected={value}
          onChange={(date) => handleChange({ target: { name: field.name, value: date } })}
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
  const [isRentalItemsReadOnly, setIsRentalItemsReadOnly] = useState(false);
  const [isDetailReadOnly, setIsDetailReadOnly] = useState(false);

  useEffect(() => {
    if (formData.rental === '필요없어요') {
      setIsRentalItemsReadOnly(true);
      setIsDetailReadOnly(true);
    } 
    else {
      setIsRentalItemsReadOnly(false);
      setIsDetailReadOnly(false);
    }
  }, [formData.rental]); // formData.rental 값이 변경될 때마다 이 훅 실행

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-6 px-4 py-10">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.left.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {/* {renderField(field, formData[field.name], handleChange)} */}
            {
              field.name === 'rentalItems' ?
                renderField(field, formData[field.name], handleChange, isRentalItemsReadOnly) :
                  field.name === 'detail' ?
                    renderField(field, formData[field.name], handleChange, isDetailReadOnly) :
                      renderField(field, formData[field.name], handleChange)
            }
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.right.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {renderField(field, formData[field.name], handleChange)}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 mt-6 rounded hover:bg-gray-800">
          등록하기
        </button>
      </div>
    </form>
  );
};

export default BContentP08;