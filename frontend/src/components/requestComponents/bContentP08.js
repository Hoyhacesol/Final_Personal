// 견적 신청

import React from 'react'; // React 임포트 필요
import { useNavigate } from 'react-router-dom';

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
    },
    {
      type: "textarea",
      label: "상세 조건",
      name: "detail",
      placeholder: "예: 인조잔디, 270mm 이상 축구화"
    }
  ],
  right: [
    {
      type: "text",
      label: "지역",
      name: "region",
      placeholder: "지역(시/도/군)을 입력해주세요",
      error: true
    },
    {
      type: "text",
      label: "날짜 및 상세 시간",
      name: "datetime",
      placeholder: "예: 2025/06/02 | 몇시 가능해요"
    },
    {
      type: "text",
      label: "인원",
      name: "people",
      placeholder: "예: 11명"
    },
    {
      type: "textarea",
      label: "요청사항",
      name: "request",
      placeholder: "예: 인조잔디인가요? 주차장 있나요? 등"
    }
  ]
};


const renderField = (field) => { 
  switch (field.type) {
    case "select":
      return (<select name={field.name} className="w-full border px-3 py-2 rounded">
        {field.options.map((option, idx) => (<option key={idx}>{option}</option>))}
      </select>);
    case "radio":
        return (
            <div className="flex gap-4 mt-1">
                {field.options.map((option, idx) => (
                    <label key={idx}>
                        <input
                            type="radio"
                            name={field.name}
                            value={option} // value 속성 추가
                            // checked={selectedValue === option} // (선택 사항) 상태 관리 시 현재 선택된 값 표시
                            // onChange={handleRadioChange} // (필수) onChange 핸들러 추가
                        /> {option}
                    </label>
                ))}
            </div>
        );
    case "text":
      return (<input type="text" name={field.name} className={`w-full border px-3 py-2 rounded ${field.error ? "border-red-500" : ""}`} placeholder={field.placeholder} />);
    case "textarea":
      return (<textarea name={field.name} rows="3" className="w-full border px-3 py-2 rounded" placeholder={field.placeholder} />);
    default:
      return null;
  }
};

const BContentP08 = () => {
  const navigate = useNavigate(); // useNavigate 훅

  const handleSubmit = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    console.log("폼이 제출되었습니다!");

    navigate('/request');
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-6 px-4 py-10">
      {/* 왼쪽 폼 */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.left.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* 오른쪽 폼 */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.right.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {renderField(field)}
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