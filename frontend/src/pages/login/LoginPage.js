import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../login/LoginPage.css";
import logo from "../../assets/img/kickauction_logo.png";
import emailicon from "../../assets/img/icon_email.svg";
import pwicon from "../../assets/img/icon_password.svg";
import socialg from "../../assets/img/social_g.png";
import socialk from "../../assets/img/social_k.png";

function LoginPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const loginError = searchParams.get("error");
  const [userid, setUserid] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 주석: 로그인 버튼 클릭 시 Spring Security POST요청
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", userid);
    formData.append("password", passwd);

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString(),
      });

      if (!res.ok) {
        throw new Error("로그인 실패");
      }

      navigate("/");
    } catch (err) {
      setError("이메일 또는 비밀번호가 계정 정보와 일치하지 않습니다.");
    }
  };

  // 주석: 구글 로그인
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // 주석: 카카오 로그인
  const handleKakaoSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="login_container">
      <div className="login_smallcontainer">
        <img src={logo} alt="킥옥션 로고" className="login_logo" />

        <form className="form_1" onSubmit={handleLogin}>
          {/* 이메일 입력 */}
          <div className="section_1">
            <img src={emailicon} alt="사용자 아이콘" className="email_icon"></img>
            <input type="text" name="username" className="login_input" placeholder="이메일 주소" required value={userid} onChange={(e) => setUserid(e.target.value)} />
          </div>
          {/* 비밀번호 입력 */}
          <div className="section_1">
            <img src={pwicon} alt="비밀번호 아이콘" className="password_icon"></img>
            <input type="password" name="password" className="login_input" placeholder="비밀번호" required value={passwd} onChange={(e) => setPasswd(e.target.value)} autoComplete="off" />
          </div>

          {/* 이메일 기억 */}
          <div className="login_remember">
            <label>
              <input type="checkbox" />
              이메일 기억하기
            </label>
          </div>

          {/* 로그인 시도 오류 */}
          {error && <p className="login_error">{error}</p>}

          {/* 로그인 */}
          <button type="submit" className="login_button">
            로그인
          </button>
        </form>

        {/* 소셜 로그인 아이콘 */}
        <div className="social_login_icons">
          <img src={socialk} alt="소셜 아이콘 카카오" onClick={handleKakaoSignup}></img>
          <img src={socialg} alt="소셜 아이콘 구글" onClick={handleGoogleSignup}></img>
        </div>

        {/* 회원정보 찾기 / 회원가입 */}
        <div className="login_help">
          <Link to="/findid">아이디/비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/presignup">킥옥션 회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
