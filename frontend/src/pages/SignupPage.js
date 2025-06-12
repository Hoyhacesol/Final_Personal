import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/SignupPage.css";
import logo from "../assets/img/kickauction_logo.png";
import socialg from "../assets/img/social_g.png";
import socialk from "../assets/img/social_k.png";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [resulterror, setResulterror] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pw2Error, setPw2Error] = useState("");

  const navigate = useNavigate();

  //주석: 이메일 적합 검사
  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  // 주석: 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResulterror("");

    if (password !== confirmPw) {
      setResulterror("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/members/signup", {
        userId: email,
        userName: nickname,
        userPw: password,
        phone: phone,
      });

      // 주석: 성공시 동작
      alert(response.data);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setResulterror(err.response.data); // 주석: 중복값 실패
      } else {
        setResulterror("입력값이 잘못되었어요 😥"); //주석: 그 외 오류
      }
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_smallcontainer">
        {/* 로고 */}
        <img src={logo} alt="킥옥션 로고" className="signup_logo" />
        <h2 style={{ textAlign: "center", marginBottom: "0.75rem", fontSize: "1.25rem", fontWeight: "500" }}>일반 유저 회원가입</h2>

        {/* 전환 버튼 */}
        <button type="button" className="change_toseller" onClick={() => navigate("/signups")}>
          ↩ ㅤ업체 가입하기
        </button>
        <form className="signup_form" onSubmit={handleSubmit}>
          {/* 주석: 이메일 */}
          <div className="signup_input_container">
            <input
              type="email"
              className="email_input input"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            />
            <button type="button" className="email_duplicheck">
              중복확인
            </button>
          </div>

          {emailError && <p className="email_error">{emailError}</p>}

          {/* 주석: 닉네임 */}
          <div className="signup_input_container">
            <input type="text" className="nickname_input input" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
            <button type="button" className="nickname_duplicheck">
              중복확인
            </button>
          </div>

          <div className="signup_input_container">
            <input type="password" className="password_input input" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="signup_input_container">
            <input type="password" className="password_check_input input" placeholder="비밀번호 재입력" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
          </div>

          <div className="signup_input_container">
            <input type="tel" className="tel_input input" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <button type="button" className="check_button">
              인증받기
            </button>
          </div>

          <p className="login_error">{resulterror || " "}</p>

          <button type="submit" className="login_button">
            가입하기
          </button>

          <button type="button" className="social_signup_k">
            <img class="socialicon" src={socialk}></img>
            카카오 계정으로 회원가입
          </button>
          <button type="button" className="social_signup_g">
            <img class="socialicon" src={socialg}></img>
            구글 계정으로 회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
