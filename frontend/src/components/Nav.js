import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";
import logo from "../assets/img/kickauction_logo.png";

const Nav = () => {
  const location = useLocation(); //주석: 현재 위치한 탭을 인식해 가상요소 효과 적용.
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 주석: 현재 로그인 중인 유저의 닉네임을 받아와 GNB {user}에 표시
  useEffect(() => {
    fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        console.log("서버 응답:", data);
        setUser(data.nickname);
      })
      .catch(() => setUser(null));
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // 주석: 로그아웃
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      // 주석:: 사용자 정보 초기화
      setUser(null);

      //주석:: 로그아웃 후 이동위치
      window.location.href = "/";
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  return (
    <nav className="nav" id="header">
      {/* 로고 영역 */}
      <Link to="/" className="nav_logo">
        <img src={logo} alt="킥옥션 로고" />
      </Link>

      {/* 메뉴 탭 영역 */}
      <ul className="nav_menu">
        <li className={location.pathname === "/request" ? "active" : ""}>
          <Link to="/request">견적 요청</Link>
        </li>
        <li className={location.pathname === "/bid" ? "active" : ""}>
          <Link to="/bid">견적 입찰</Link>
        </li>
        <li className={location.pathname === "/sellerlist" ? "active" : ""}>
          <Link to="/sellerlist">등록된 업체 목록</Link>
        </li>
        <li className={location.pathname === "/community" ? "active" : ""}>
          <Link to="/community">자유게시판</Link>
        </li>
        <li className={location.pathname === "/help" ? "active" : ""}>
          <Link to="/help">고객센터</Link>
        </li>
      </ul>

      {/* 로그인/회원가입 or 사용자 메뉴 */}
      <div className="nav_auth">
        {!user ? (
          <Link to="/login" className="loginbtn">
            로그인 / 회원가입
          </Link>
        ) : (
          <div className="user_dropdown">
            <button onClick={toggleDropdown} className="user_button">
              {user} 님 ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown_menu">
                <Link to="/mypage">마이페이지</Link>
                <a href="#" onClick={handleLogout}>
                  로그아웃
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
export default Nav;
