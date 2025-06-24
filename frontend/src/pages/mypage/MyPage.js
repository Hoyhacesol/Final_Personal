import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { getSellerRegisterInfo, getSellerRegistered } from "../../api/SellerApi";
import "../../css/Sharesheet.css";
import "../mypage/MyPage.css";

const MyPage = () => {
  console.log("MyPage loaded");

  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showinputModal, setShowinputModal] = useState(false);
  const [newSname, setNewSname] = useState("");
  const [newSlocation, setNewSlocation] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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

  // 주석: ROLE변경
  const handleRoleToggle = async () => {
    if (user.role === "USER") {
      // user에서 seller로
      try {
        const res = await axios.get(`http://localhost:8080/api/members/checkseller`, {
          params: { mno: user.mno },
        });

        if (res.data.exists) {
          // 기존 seller데이터 존재
          await axios.patch("http://localhost:8080/api/members/changetoseller", null, {
            params: {
              mno: user.mno,
            },
          });
          alert("판매 업체로 변경되셨습니다.");
          navigate(0);
        } else {
          // seller데이터 없음
          setShowinputModal(true);
        }
      } catch (err) {
        alert("변경 실패");
      }
    } else {
      // seller에서 user로
      await axios.patch("http://localhost:8080/api/members/changetouser", null, {
        params: {
          mno: user.mno,
        },
      });
      alert("일반 유저로 변경되셨습니다.");
      navigate(0);
    }
  };

  // modal에서 업체 데이터 제출
  const handleSubmitSellerInfo = async () => {
    if (!newSname || !newSlocation) {
      return alert("항목을 비울 수 없습니다.");
    }

    try {
      await axios.patch("http://localhost:8080/api/members/changetoseller", null, {
        params: {
          mno: user.mno,
          sname: newSname,
          slocation: newSlocation,
        },
      });
      alert("판매 업체로 변경되셨습니다.");
      setShowinputModal(false);
      navigate(0);
    } catch (err) {
      alert("전환 실패: " + err.message);
    }
  };

  return (
    <div className="mypage_container">
      <div className="mypage_header">
        <h2 className="mypage_title">마이페이지</h2>
        {user.role === "USER" && (
          <button className="role_change_button" onClick={handleRoleToggle}>
            ↺ ㅤ업체로 전환하기
          </button>
        )}
        {user.role === "SELLER" && (
          <button className="role_change_button" onClick={handleRoleToggle}>
            ↺ ㅤ 일반 유저로 전환하기
          </button>
        )}
      </div>

      {/* ROLE 최초 변경시 SELLER필요데이터 입력MODAL */}
      {showinputModal && (
        <div className="modal_overlay">
          <div className="modal_container">
            <h3>업체 정보 입력</h3>
            <input type="text" placeholder="업체명" value={newSname} onChange={(e) => setNewSname(e.target.value)} />
            <input type="text" placeholder="업체 주소" value={newSlocation} onChange={(e) => setNewSlocation(e.target.value)} />
            <div className="modal_buttons">
              <button onClick={handleSubmitSellerInfo}>등록</button>
              <button onClick={() => setShowinputModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 정보 */}
      <section className="mypage_section">
        <h3 className="section_title">내 정보</h3>

        {/* 프사 */}
        <div className="profile_image_wrapper">
          <img key={user.profileimg} src={`http://localhost:8080/images/${user.profileimg || "baseprofile.png"}?t=${new Date().getTime()}`} alt="프로필 이미지" className="profile_image" />
        </div>
        <div className="myinfo_wrapper">
          <p className="user_name">
            <strong>{user.nickname}</strong> 님{user.role === "USER" && <span className="role_badge badge_user">일반 유저</span>}
            {user.role === "SELLER" && <span className="role_badge badge_seller">업체 유저</span>}
            {user.role === "ADMIN" && <span className="role_badge badge_admin">운영진</span>}
            <br />
            <span className="user_email">({user.user_id})</span>
          </p>
          <Link to={user.social === 0 ? "/updateinfosocial" : "/updateinfo"}>
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
                <p className="company_no"> 등록된 업체가 없습니다.</p>
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
