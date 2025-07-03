// 견적 신청

import React, { useState, useEffect } from 'react';
// 오류 발생시 참고 -> tailwind처럼 처음 사용시 npm install react-datepicker & date-fns 두개 필요***
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import "./requestDebugStyle.css";


const formFields = {
  left: [
    {
      type: "text",
      label: "제목",
      name: "otitle",
      placeholder: "제목을 입력해주세요"
    },
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
      type: "checkbox-number",
      label: "대여할 장비 목록",
      name: "rentalEquipment",
      options: ["축구화", "팀조끼", "축구공", "기타"], 
      placeholder: "기타 장비를 입력하세요" 
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
        className="input-setting-p08">
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
          className={`input-setting-p08 ${field.error ? "border-red-500" : ""}`}
          placeholder={currentPlaceholder}
          readOnly={isReadOnly}
          maxLength={field.name === 'rentalTime' ? 5 : undefined}
        />
      );
    case "textarea":
      return (
        <textarea
          name={field.name}
          value={value}
          onChange={handleChange}
          className="input-setting-p08"
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
              className="input-setting-p08"
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
          className="input-setting-p08"
          dateFormat="yyyy/MM/dd"
          placeholderText="날짜를 선택하세요"
        />
      );
    case "checkbox-number":
      return (
          <div className="check-box-space-y-2">
              {field.options.map((option, idx) => (
                  <div key={idx} className="check-box-custiom">
                      <input
                          type="checkbox"
                          name={`${field.name}-${option}`}
                          checked={!!value[option] || (option === '기타' && value[option] !== undefined && value[option].trim() !== '')}
                          onChange={handleChange}
                          disabled={isReadOnly}
                          className="form-checkbox"
                      />
                      <label className="check-box-mr-2">{option}</label>

                      {/* '기타'는 항상 보이고, 나머지 필드는 체크되었을 때만 보이도록 조건부 렌더링 */}
                      {(option === '기타' || !!value[option]) && (
                          option === '기타' ? (
                              <input
                                  type="text"
                                  name={`${field.name}-${option}`}
                                  value={value[option] || ''}
                                  onChange={(e) => {
                                    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/;
                                    if (regex.test(e.target.value)) {
                                      handleChange(e);
                                    }
                                  }}
                                  placeholder={currentPlaceholder}
                                  readOnly={isReadOnly} // '기타'는 체크 여부와 상관없이 항상 입력 가능해야 하므로 readOnly 조건을 단순화
                                  className="check-box-setting-grow"
                              />
                          ) : (
                              <input
                                  type="number"
                                  name={`${field.name}-${option}`}
                                  value={value[option] || 0}
                                  onChange={handleChange}
                                  readOnly={isReadOnly} // readOnly 조건을 단순화
                                  className="check-box-setting-ori"
                                  min="1"
                                  max="99"
                                  step="1"
                              />
                          )
                      )}
                  </div>
              ))}
          </div>
      );
    default:
      return null;
  }
};

const BContentP08 = ({ formData, handleChange, handleSubmit, formSubmitted, errors = {}, isSubmitting = false }) => {
  const [isRentalEquipmentReadOnly, setIsRentalEquipmentReadOnly] = useState(false);
  const [sidoList, setSidoList] = useState([]);
  const [selectedSido, setSelectedSido] = useState("");
  const [sigunguList, setSigunguList] = useState([]);


  // 장비대여여부 전환 훅
  useEffect(() => {
    if (formData.rental === "필요없어요") {
      setIsRentalEquipmentReadOnly(true);
    } 
    else { // formData.rental === "필요해요"
      setIsRentalEquipmentReadOnly(false);
    }
  }, [formData.rental]);



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< region <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  useEffect(() => {
    fetch("/api/vworld/sido")
      .then(res => res.json())
      .then(json => {
        const list = json.response.result.featureCollection.features.map(f => ({
          code: f.properties.ctprvn_cd,
          name: f.properties.ctp_kor_nm
        }));
        setSidoList(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSido) return;
    fetch(`/api/vworld/sigungu?sidoName=${encodeURIComponent(selectedSido)}`)
      .then(res => res.json())
      .then(json => {
        if (
          json?.response?.status === "OK" &&
          json?.response?.result?.featureCollection?.features
        ) {
          const list = json.response.result.featureCollection.features.map(f => ({
            code: f.properties.sig_cd,
            name: f.properties.sig_kor_nm
          }));
          setSigunguList(list);
        } else {
          if(!selectedSido==="세종특별자치시"){
            console.warn("시군구 데이터 없음 또는 응답 실패", json);
          }
          setSigunguList([]);
        }
      })
      .catch(err => {
        console.error("시군구 API 요청 실패:", err);
        setSigunguList([]);
      });

  }, [selectedSido]);


  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  return   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  return (
    <div className='request-body bg-cover bg-center'>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {/* 왼 */}
        <div className="form-card">
          {formFields.left.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label>{field.label}</label>
              {
                field.name === 'rentalEquipment' ?
                  renderField(field, formData[field.name], handleChange, isRentalEquipmentReadOnly) :
                  renderField(field, formData[field.name], handleChange)
              }
              {formSubmitted && errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
        {/* 오 */}
        <div className="form-card">
          {formFields.right.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label>{field.label}</label>
              {
                field.name === 'region' ?
                // 여기에 지역을 입력받을 새로운 필드 랜더링
                (
                  <div className="">
                    <select value={selectedSido} onChange={e => {
                      const value = e.target.value;
                      setSelectedSido(value);

                      // 세종시인 경우 바로 지역 지정
                      if (value === "세종특별자치시") {
                        handleChange({ target: { name: "region", value: "세종특별자치시" } });
                        setSigunguList([]); // 시군구 비움
                      } else {
                        handleChange({ target: { name: "region", value: value } }); 
                      }
                    }}>
                      <option value="">시/도</option>
                      {sidoList.map(s => (
                        <option key={s.code} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                    {selectedSido !== "세종특별자치시" && (
                      <>
                        <select
                          value={(formData.region?.split(" ") || []).slice(1).join(" ")}
                          onChange={e => {
                            const region = `${selectedSido} ${e.target.value}`;
                            handleChange({ target: { name: "region", value: region } });
                          }}
                          disabled={!sigunguList.length}
                        >
                          {/* 시/군/구 플레이스홀더 */}
                          <option value="">시/군/구</option>
                          {sigunguList.map(s => (
                            <option key={s.code} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                )
                // 일반 입력 필드 생성
                : (renderField(field, formData[field.name], handleChange))
              }
              {formSubmitted && errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="full-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BContentP08;