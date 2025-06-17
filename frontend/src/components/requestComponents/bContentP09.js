import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const renderField = (field, value, handleChange) => {
  switch (field.type) {
    case "select":
      return (
        <select name={field.name} value={value} onChange={handleChange}
          className="w-full border px-3 py-2 rounded">
          {field.options.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
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
              />
              {" "}{option}
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
          placeholder={field.placeholder}
        />
      );
    case "textarea":
      return (
        <textarea
          name={field.name}
          value={value}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
          placeholder={field.placeholder}
        />
      );
    default:
      return null;
  }
};

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

const initialFields = {
  sport: "",
  rental: "",
  rentalItems: "",
  detail: "",
  region: "",
  datetime: "",
  people: "",
  request: ""
};

const BContentP09 = () => {
  const navigate = useNavigate();
  const { ono } = useParams();
  const [formData, setFormData] = useState(initialFields);

  useEffect(() => {
    axios.get(`/api/orders/${ono}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("견적 정보 불러오기 실패:", err));
  }, [ono]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.patch(`/api/orders/${ono}`, formData)
      .then(() => {
        alert("수정 완료되었습니다!");
        navigate("/request");
      })
      .catch((err) => {
        alert("수정 실패! 콘솔 확인");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-6 px-4 py-10">
      {/* 왼쪽 폼 */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.left.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {renderField(field, formData[field.name], handleChange)}
          </div>
        ))}
      </div>

      {/* 오른쪽 폼 */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        {formFields.right.map((field, idx) => (
          <div key={idx} className="mt-4">
            <label className="block font-semibold mb-1">{field.label}</label>
            {renderField(field, formData[field.name], handleChange)}
          </div>
        ))}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-1/2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400">
            취소
          </button>
          <button
            type="submit"
            className="w-1/2 bg-black text-white py-2 rounded hover:bg-gray-800">
            수정 완료
          </button>
        </div>
      </div>
    </form>
  );
};

export default BContentP09;