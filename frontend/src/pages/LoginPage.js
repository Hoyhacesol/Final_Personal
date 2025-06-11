import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/LoginPage.css";
import logo from "../assets/img/kickauction_logo.png";
import emailicon from "../assets/img/icon-email.svg";
import pwicon from "../assets/img/icon-password.svg";
import socialg from "../assets/img/social_g.png";
import socialk from "../assets/img/social_k.png";

function LoginPage() {
  const [userid, setUserid] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userid, passwd }),
      });
      if (!res.ok) throw new Error("로그인 실패");
      navigate("/");
    } catch (err) {
      setError("이메일 또는 비밀번호가 계정 정보와 일치하지 않습니다.");
    }
  };

  return (
    <div className="login_container">
      <div className="login_smallcontainer">
        <img src={logo} alt="킥옥션 로고" className="login_logo" />

        <form class="form_1" onSubmit={handleLogin}>
          <div class="section_1">
            <img src={emailicon} alt="사용자 아이콘" className="email_icon"></img>
            <input type="text" className="login_input" placeholder="이메일 주소" value={userid} onChange={(e) => setUserid(e.target.value)} required />
          </div>
          <div class="section_1">
            <img src={pwicon} alt="비밀번호 아이콘" className="password_icon"></img>
            <input type="password" className="login_input" placeholder="비밀번호" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />
          </div>
          {error && <p className="login_error">{error}</p>}

          <div className="login_remember">
            <label>
              <input type="checkbox" />
              이메일 기억하기
            </label>
          </div>

          <button type="submit" className="login_button">
            로그인
          </button>
        </form>

        <div className="social_login_icons">
          <img src={socialk}></img>
          <img src={socialg}></img>
        </div>

        <div className="login_help">
          <Link to="/findid">아이디/비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/signup">킥옥션 회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
