import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { checkAuth } from "../../api/authApi";
import "../login/LoginPage.css";
import "../../css/Sharesheet.css";
import logo from "../../assets/img/logo_v2.png";
import emailicon from "../../assets/img/icon_email.svg";
import pwicon from "../../assets/img/icon_password.svg";
import socialg from "../../assets/img/social_g.png";
import socialk from "../../assets/img/social_k.png";

function LoginPage() {
  const location = useLocation();
  const redirectPath = location.state?.from || "/";
  const searchParams = new URLSearchParams(location.search);
  const loginError = searchParams.get("error");
  const [userid, setUserid] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false); //이메일기억
  const { setUser } = useAuth(); // 전역 사용자 상태 업데이트 함수

  // 주석: 이메일 기억하기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setUserid(savedEmail);
      setRemember(true);
    }
  }, []);

  // 주석: 로그인 버튼 클릭 시 Spring Security POST요청
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", userid);
    formData.append("password", passwd);

    try {
      const res = await fetch("http://localhost:8080/login", {
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

      // 주석: 로그인 성공 후 내 정보 요청
      const userData = await checkAuth();

      setUser(userData);
      console.log("userData:", userData);

      if (remember) {
        localStorage.setItem("rememberedEmail", userid);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate(redirectPath);
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
        <Link to="/">
          <img src={logo} alt="킥옥션 로고" className="login_logo" />
        </Link>

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
          <div className="login_checkbox">
            <label className="l_checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="checkmark" />
              <span className="l_text">이메일 기억하기</span>
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
          <div className="social_icon_wrapper" onClick={handleKakaoSignup}>
            <img src={socialk} alt="소셜 아이콘 카카오" />
          </div>
          <div className="social_icon_wrapper" onClick={handleGoogleSignup}>
            <img src={socialg} alt="소셜 아이콘 구글" />
          </div>
        </div>

        {/* 회원정보 찾기 / 회원가입 */}
        <div className="login_help">
          <Link to="/findinfo">아이디/비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/presignup">킥옥션 회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
