import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";
import logo from "../assets/img/kickauction_logo.png";

const Nav = () => {
  const location = useLocation(); //주석:: 현재 위치한 탭을 인식해 가상요소 효과 적용.

  return (
    <nav className="nav" id="header">
      {/* 주석::로고 영역 */}
      <Link to="/" className="nav_logo">
        <img src={logo} alt="킥옥션 로고" />
      </Link>

      {/* 주석::메뉴 탭 영역 */}
      <ul className="nav_menu">
        <li className={location.pathname === "/request" ? "active" : ""}>
          <Link to="/request">견적 요청</Link>
        </li>
        <li className={location.pathname === "/bid" ? "active" : ""}>
          <Link to="/bid">견적 입찰</Link>
        </li>
        <li className={location.pathname === "/companylist" ? "active" : ""}>
          <Link to="/companylist">등록된 업체 목록</Link>
        </li>
        <li className={location.pathname === "/community" ? "active" : ""}>
          <Link to="/community">자유게시판</Link>
        </li>
        <li className={location.pathname === "/help" ? "active" : ""}>
          <Link to="/help">고객센터</Link>
        </li>
      </ul>

      {/* 주석::로그인/회원가입 영역 */}
      <div className="nav_auth">
        <Link to="/login" className="loginbtn">
          로그인 / 회원가입
        </Link>
      </div>
    </nav>
  );
};
export default Nav;
