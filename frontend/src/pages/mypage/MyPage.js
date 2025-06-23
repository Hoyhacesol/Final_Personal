import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { getSellerRegisterInfo, getSellerRegistered } from "../../api/SellerApi";
import "../../css/Sharesheet.css";
import "../mypage/MyPage.css";

const MyPage = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    console.log("[MyPage] 현재 로그인된 사용자:", user);
    const fetchCompanyInfo = async () => {
      if (!user?.mno || user.role !== "SELLER") return;

      try {
        const [basicInfo, registered] = await Promise.all([getSellerRegisterInfo(user.mno), getSellerRegistered()]);

        setCompany({
          sname: basicInfo.sname,
          slocation: basicInfo.slocation,
        });
        setIsRegistered(registered);
      } catch (err) {
        console.error("업체 기본 정보 또는 등록 여부 조회 실패", err);
      }
    };

    fetchCompanyInfo();
  }, [user?.mno]);

  if (!user) return <p>비정상적인 접근입니다. 로그인 상태를 확인하세요.</p>;

  return (
    <div className="mypage_container">
      <h2 className="mypage_title">마이페이지</h2>

      {/* 회원 정보 */}
      <section className="mypage_section">
        <h3 className="section_title">내 정보</h3>

        {/* 프사 */}
        <div className="profile_image_wrapper">
          <img key={user.profileimg} src={`http://localhost:8080/images/${user.profileimg || "baseprofile.png"}?t=${new Date().getTime()}`} alt="프로필 이미지" className="profile_image" />
        </div>
        <div className="myinfo_wrapper">
          <p className="user_name">
            <strong>{user.nickname}</strong> 님<br />
            <span className="user_email">({user.user_id})</span>
          </p>
          <Link to="/updateinfo">
            <button className="update_button">회원정보 수정</button>
          </Link>
        </div>
      </section>

      {/* 견적 정보 */}
      <section className="mypage_section">
        <div className="myrequest_wrapper">
          <h3 className="section_title">내 견적</h3>
          <div className="request_info_container">
            <div className="request_texts">
              <p className="request_info">
                현재 진행중 견적: <strong className="textcolor1">n</strong>개
              </p>
              <p className="request_info">
                완료된 견적: <strong className="textcolor2">n</strong>개
              </p>
            </div>
            <button className="request_info_button">견적 상세정보</button>
          </div>
        </div>
      </section>

      {/* 업체 정보 (SELLER 전용) */}
      {user?.role === "SELLER" && (
        <section className="mypage_section">
          <div className="mycomp_wrapper">
            <h3 className="section_title">내 업체 정보</h3>
            <div className="mycomp_container">
              {company ? (
                <div className="company_infos">
                  <p className="company_name">
                    {" "}
                    <strong>{company.sname}</strong>
                  </p>
                  <p className="company_address"> {company.slocation}</p>
                </div>
              ) : (
                <p className="company_infos">❔❔ 등록된 업체가 없습니다.</p>
              )}

              {isRegistered ? (
                <button className="comp_info_button">업체정보 수정</button>
              ) : (
                <button className="comp_info_button2" disabled>
                  수정 전 <br></br>업체소개 작성 필요
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MyPage;
