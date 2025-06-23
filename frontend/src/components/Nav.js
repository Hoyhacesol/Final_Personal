import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import "./Nav.css";
import "../css/Sharesheet.css";
// import logo from "../assets/img/kickauction_logo.png";
import logo2 from "../assets/img/logo_v2.png";

const Nav = () => {
  const location = useLocation(); //주석: 현재 위치한 탭을 인식해 가상요소 효과 적용.

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [latestRequestCount, setLatestRequestCount] = useState(null);
  const { user, setUser } = useAuth();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // 주석: 로그아웃
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      //주석:: 로그아웃 후 이동위치
      setUser(null);
      navigate(location.pathname);
      // window.location.href = "/";
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };
  // 주석: (모바일) 메뉴 이동 시 사이드바 닫음
  const handleLinkClick = () => {
    closeSidebar();
  };

  return (
    <>
      <nav className="nav" id="header">
        {/* 로고 영역 */}
        <Link to="/" className="nav_logo">
          <img src={logo2} alt="킥옥션 로고" />
        </Link>

        {/* 메뉴 탭 영역 */}
        <ul className="nav_menu">
          <li className={location.pathname.startsWith("/request") ? "active" : ""}>
            <Link to="/request">견적 요청</Link>
          </li>
          <li className={location.pathname.startsWith("/bid") ? "active" : ""}>
            <Link to="/bid">견적 입찰</Link>
          </li>
          <li className={location.pathname.startsWith("/sellerlist") ? "active" : ""}>
            <Link to="/sellerlist">등록된 업체 목록</Link>
          </li>
          <li className={location.pathname.startsWith("/community") ? "active" : ""}>
            <Link to="/community">자유게시판</Link>
          </li>
          <li className={location.pathname.startsWith("/help") ? "active" : ""}>
            <Link to="/help">고객센터</Link>
          </li>
        </ul>

        {/* 로그인/회원가입 or 사용자 메뉴 */}
        <div className="nav_auth">
          {!user ? (
            <Link to="/login" state={{ from: location.pathname }} className="loginbtn">
              로그인 / 회원가입
            </Link>
          ) : (
            <div className="user_dropdown">
              <button onClick={toggleDropdown} className="user_button">
                {user.nickname} 님{" "}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#555">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <div className={`user_dropdown_box ${dropdownOpen ? "open" : ""}`}>
                <img className="profile_img_dropdown" src={`http://localhost:8080/images/${user.profileimg || "baseprofile.png"}`} alt="프로필 사진" />
                <p>
                  안녕하세요! <br />
                  <strong>{user.nickname}</strong> 님
                </p>
                <p className="recentsuggest">
                  {/* 최근 견적 요청에 <strong>{latestRequestCount}</strong>개의 제안 도착 */}
                  최근 견적 요청에 <span className="recentsuggest_count">3 </span>개의 제안이 도착했어요.
                </p>
                <div className="sidebar_buttons">
                  <Link to="/mypage" className="dropdown_btn" onClick={() => setDropdownOpen(false)}>
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className="dropdown_btn">
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 모바일 전용 상단 바 */}
      <div className="mobile_topbar">
        <div className="mobile_left" onClick={toggleSidebar}>
          ☰
        </div>
        <div className="mobile_center">
          <img src={logo2} alt="로고" className="mobile_logo" />
        </div>
        <div className="mobile_right">⋮</div>
      </div>

      {/* 오버레이 */}
      {isSidebarOpen && <div className="sidebar_overlay" onClick={closeSidebar}></div>}

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <div className="sidebar_userbox">
          {!user ? (
            <>
              <img className="profile_img" src={`http://localhost:8080/images/baseprofile.png`} alt="비로그인 프로필 사진" />
              <p>비로그인 상태입니다.</p>
              <div className="sidebar_buttons">
                <Link to="/login" state={{ from: location.pathname }} onClick={handleLinkClick} className="sidebar_btn">
                  로그인
                </Link>
                <Link to="/presignup" onClick={handleLinkClick} className="sidebar_btn">
                  회원가입
                </Link>
              </div>
            </>
          ) : (
            <>
              <img className="profile_img" src={`http://localhost:8080/images/${user.profileimg || "baseprofile.png"}`} alt="프로필 사진" />
              <p>
                안녕하세요! <br />
                <strong>{user.nickname}</strong> 님
              </p>
              <p className="recentsuggest">
                {/* 최근 견적 요청에 <strong>{latestRequestCount}</strong>개의 제안 도착 */}
                최근 견적 요청에 <span className="recentsuggest_count">3 </span>개의 제안이 도착했어요.
              </p>
              <div className="sidebar_buttons">
                <Link to="/mypage" onClick={handleLinkClick} className="sidebar_btn2">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="sidebar_btn2">
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>

        <nav className="sidebar_nav">
          <Link className="backtohome" to="/" onClick={handleLinkClick}>
            ↩ 메인화면
          </Link>
          <Link to="/request" onClick={handleLinkClick}>
            견적 요청
          </Link>
          <Link to="/bid" onClick={handleLinkClick}>
            견적 입찰
          </Link>
          <Link to="/sellerlist" onClick={handleLinkClick}>
            등록된 업체 목록
          </Link>
          <Link to="/community" onClick={handleLinkClick}>
            자유게시판
          </Link>
          <Link to="/help" onClick={handleLinkClick}>
            고객센터
          </Link>
        </nav>
      </div>
    </>
  );
};
export default Nav;
