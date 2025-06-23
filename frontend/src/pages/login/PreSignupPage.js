import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../login/SignupPage.css";
import "../../css/Sharesheet.css";
import logo from "../../assets/img/logo_v2.png";
import socialg from "../../assets/img/social_g.png";
import socialk from "../../assets/img/social_k.png";

function PreSignupPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const navigate = useNavigate();

  //주석: 이메일 적합 검사
  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      setIsDuplicate(false);
    } else {
      setEmailError("");
      setIsDuplicate(false);
    }
  };
  // 주석: [다음] 클릭 시 중복체크 & signuppage로 이동
  const preNext = async (e) => {
    e.preventDefault();

    if (!email || emailError) {
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/members/email_check`, {
        params: { email: email },
      });

      if (res.data.exists) {
        setEmailError("이미 가입된 이메일입니다.");
        setIsDuplicate(true);
      } else {
        navigate("/signup", { state: { email } });
        setIsDuplicate(false);
      }
    } catch (err) {
      setEmailError("오류가 발생했어요 😥");
    }
  };

  // 주석: 구글 회원가입
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // 주석: 카카오 회원가입
  const handleKakaoSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };
  return (
    <div className="signup_container">
      <div className="signup_smallcontainer">
        {/* 로고 */}
        <Link to="/">
          <img src={logo} alt="킥옥션 로고" className="signup_logo" />
        </Link>
        <h2 className="signup_title">일반 회원가입</h2>

        {/* 전환 버튼 */}
        <div className="change_toseller">
          <Link to="/presignupseller">＃ 장비 대여·판매 업체로 가입하시겠어요?</Link>
        </div>

        <form className="signup_form" onSubmit={preNext}>
          {/* 주석: 이메일 */}
          <div className="signup_input_container">
            <input
              type="email"
              className="email_input_pre input"
              placeholder="이메일로 가입.."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            />
          </div>

          {/* 주석: 에러메시지- 중복데이터 발견 시 로그인버튼 생성ㅇ */}
          {emailError && <p className="error">{emailError}</p>}
          {isDuplicate && (
            <div className="goto_login">
              <Link to="/login">↩ㅤ로그인하러 가기</Link>
            </div>
          )}

          {/* 추가데이터 입력 */}
          <button type="submit" className="pre_signup_button">
            계속
          </button>

          <div className="divider">
            <span>또는</span>
          </div>

          {/* 소셜 회원가입 */}
          <button type="button" className="social_signup_g" onClick={handleGoogleSignup}>
            <img className="socialicon" src={socialg}></img>
            구글 계정으로 회원가입
          </button>

          <button type="button" className="social_signup_k" onClick={handleKakaoSignup}>
            <img className="socialicon" src={socialk}></img>
            카카오 계정으로 회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreSignupPage;
