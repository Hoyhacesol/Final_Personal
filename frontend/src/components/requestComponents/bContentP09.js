import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
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


const BContentP09 = ({ formData, handleChange, handleSubmit, formSubmitted, errors = {} }) => {
  const navigate = useNavigate();
  // const { ono } = useParams();
  const [isRentalEquipmentReadOnly, setIsRentalEquipmentReadOnly] = useState(false);
  const [sidoList, setSidoList] = useState([]);
  const [selectedSido, setSelectedSido] = useState("");
  const [sigunguList, setSigunguList] = useState([]);

  //처음 랜더 훅
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [sidoRes, orderRes] = await Promise.all([
  //         fetch("/api/vworld/sido").then(res => res.json()),
  //         axios.get(`/api/orders/${ono}`)
  //       ]);

  //       const fetchedData = orderRes.data;

  //       // 시도 리스트
  //       const sidoListData = sidoRes.response.result.featureCollection.features.map(f => ({
  //         code: f.properties.ctprvn_cd,
  //         name: f.properties.ctp_kor_nm
  //       }));
  //       setSidoList(sidoListData);

  //       // rental 여부 판단
  //       const defaultRental = (fetchedData.rentalEquipment && fetchedData.rentalEquipment.trim() !== "")
  //         ? "필요해요" : "필요없어요";

  //       setSavedRentalEquipment(fetchedData.rentalEquipment || '');

  //       // 모든 필드에 대해 null/undefined 방지 및 기본값 설정
  //       // (initialFields에 없더라도 여기에 추가하면 formData에 포함됨)
  //       setFormData({
  //         playType: fetchedData.playType || "",
  //         rental: defaultRental,
  //         rentalEquipment: fetchedData.rentalEquipment || "",
  //         region: fetchedData.region || "",
  //         rentalDate: fetchedData.rentalDate || null,
  //         rentalTime: fetchedData.rentalTime || "",
  //         person: fetchedData.person || "",
  //         ocontent: fetchedData.ocontent || "",
  //         ono: fetchedData.ono,
  //         mno: fetchedData.mno,
  //         oregdate: fetchedData.oregdate,
  //         finished: fetchedData.finished,
  //       });

  //       // 시도 선택값 추출
  //       const regionParts = fetchedData.region?.split(" ");
  //       if (regionParts?.length >= 1) {
  //         setSelectedSido(regionParts[0]);
  //       }

  //     } catch (err) {
  //       console.error("시도/견적 데이터 로딩 실패:", err);
  //     }
  //   };

  //   fetchData();
  // }, [ono]);


  // 장비대여여부 전환 훅
  useEffect(() => {
    if (formData.rental === '필요없어요') {
      setIsRentalEquipmentReadOnly(true);
    } else {
      setIsRentalEquipmentReadOnly(false);
    }
  }, [formData.rental]);

  //지역 정보를 select 두개로 나눠서 표기하기 위한 훅
  useEffect(() => {
    if (formData.region) {
      const parts = formData.region.split(" ");
      if (parts.length === 2) {
        setSelectedSido(parts[0]);
      } else if (parts.length === 1) {
        // 예외: 세종시 같은 단일 행정구역
        setSelectedSido(parts[0]);
      }
    } else { // formData.region이 비어있을 경우 selectedSido 초기화
      setSelectedSido("");
    }
  }, [formData.region, sidoList]);
  // 시/도 목록 로드
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
  // 지역정보 api 훅
  useEffect(() => {
    if (!selectedSido) return;

    if (selectedSido === "세종특별자치시") {
      setSigunguList([]); // 시군구 없음
      return;
    }

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
          setSigunguList([]);
        }
      })
      .catch(err => {
        console.error("시군구 API 요청 실패:", err);
        setSigunguList([]);
      });
  }, [selectedSido]);


  // // 완료 버튼 동작
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.patch(`/api/orders/${ono}`, formData)
  //     .then(() => {
  //       alert("수정 완료");
  //       navigate("/request");
  //     })
  //     .catch((err) => {
  //       alert("수정 실패");
  //       console.error(err);
  //     });
  // };

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
              {formSubmitted && errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
        {/* 오른쪽 폼 */}
        <div className="form-card">
          {formFields.right.map((field, idx) => (
            <div key={idx} className="mt-4">
              <label className="block font-semibold mb-1">{field.label}</label>
              {
                field.name === "region" ? (
                  <div className="flex gap-4">
                    <select
                      value={selectedSido}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSido(value);

                        if (value === "세종특별자치시") {
                          handleChange({ target: { name: "region", value } });
                          setSigunguList([]);
                        } else {
                          handleChange({ target: { name: "region", value: value } });
                        }
                      }}
                    >
                      <option value="">시/도</option>
                      {sidoList.map(s => (
                        <option key={s.code} value={s.name}>{s.name}</option>
                      ))}
                    </select>

                    {selectedSido !== "세종특별자치시" && (
                      <select
                        value={formData.region.split(" ")[1] || ""}
                        onChange={(e) => {
                          const region = `${selectedSido} ${e.target.value}`;
                          handleChange({ target: { name: "region", value: region } });
                        }}
                        disabled={!sigunguList.length}
                      >
                        {/* 시/군/구 플레이스홀더 조건부 렌더링 */}
                        {(!formData.region || formData.region.split(" ")[0] !== selectedSido || formData.region.split(" ")[1] === "") &&
                          <option value="">시/군/구</option>}
                        {sigunguList.map(s => (
                          <option key={s.code} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  renderField(field, formData[field.name], handleChange)
                )
              }
              {formSubmitted && errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
              )}
            </div>
          ))}
          <div className="rq-button-group">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button">
              취소
            </button>
            <button
              type="submit"
              className="submit-button">
              등록
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BContentP09;