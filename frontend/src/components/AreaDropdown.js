import { useState,useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import regionData from "../data/korean_regions.json";
import "../css/AreaDropdown.css";

const AreaDropdown = ({ onChange, city="", district=""}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState({ city: "지역", district: "" });
  const [selectedCity, setSelectedCity] = useState("");

  const fullCityMap = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전라북도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

  useEffect(() => {
    if (city) {
      setSelectedRegion({ city: city || "지역", district: district || "" });
      setSelectedCity(city);
    }
  }, [city, district]);


  const renderButtonText = () => {
  if (selectedRegion.city === "지역") return "지역";
  if (selectedRegion.city === "전국") return "전국";
  if (!selectedRegion.district) return selectedRegion.city;
  return `${selectedRegion.city} ${selectedRegion.district}`;
};

  const handleSelectCity = (city) => {
    const districts = regionData[city];
    if (!districts || districts.length === 0) {
      const newRegion = { city, district: "" };
      setSelectedRegion(newRegion);
      onChange?.(newRegion);
      setOpen(false);
      setStep(1);
    } else {
      setSelectedCity(city);
      setStep(2);
    }
  };

  const handleSelectDistrict = (district) => {
    const newRegion = { city: selectedCity, district };
    setSelectedRegion(newRegion);
    onChange?.(newRegion);
    setOpen(false);
    setStep(1);
  };

  const handleCityAll = () => {
    const newRegion = { city: selectedCity, district: "" };
    setSelectedRegion(newRegion);
    onChange?.(newRegion);
    setOpen(false);
    setStep(1);
  };

  

  const ArrowIcon = open ? FaChevronUp : FaChevronDown;

  return (
    <div className="area-dropdown-wrapper">
      <button className="area-dropdown-button" onClick={() => setOpen(!open)}>
        {renderButtonText()} <ArrowIcon className="dropdown-arrow" />
      </button>

      {open && (
        <div className="area-dropdown-menu">
          <div className="area-dropdown-header">
            <span>{step === 1 ? "지역 선택" : `${selectedCity} 지역 선택`}</span>
            <button className="area-dropdown-close" onClick={() => { setOpen(false); setStep(1); }}>×</button>
          </div>

         <ul className="area-dropdown-list">
          {step === 1 ? (
            <>
              <li onClick={() => {
                const newRegion = { city: "전국", district: "" };
                setSelectedRegion(newRegion);
                onChange?.(newRegion);
                setOpen(false);
                setStep(1);
              }}>
                전국
              </li>
              {Object.keys(regionData).map(city => (
                <li key={city} onClick={() => handleSelectCity(city)}>
                  {city} <FaChevronDown className="dropdown-inline-icon" />
                </li>
              ))}
            </>
          ) : (
            <>
              <li onClick={handleCityAll}>
                {selectedCity} 전체
              </li>
              {regionData[selectedCity].map(district => (
                <li key={district} onClick={() => handleSelectDistrict(district)}>
                  {district}
                </li>
              ))}
            </>
          )}
        </ul>

        </div>
      )}
    </div>
  );
};

export default AreaDropdown;
