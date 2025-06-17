import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/SignupPage.css";
import logo from "../../assets/img/kickauction_logo.png";
import socialg from "../../assets/img/social_g.png";
import socialk from "../../assets/img/social_k.png";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [companyaddress, setCompanyaddress] = useState("");

  const navigate = useNavigate();

  return (
    <div className="signup_container">
      <div className="signup_smallcontainer">
        <img src={logo} alt="킥옥션 로고" className="signup_logo" />
        <h2 style={{ textAlign: "center", marginBottom: "0.75rem", fontSize: "1.25rem", fontWeight: "500" }}>판매업체 회원가입</h2>

        <button type="button" className="change_touser" onClick={() => navigate("/presignup")}>
          ↩ ㅤ일반 유저 가입하기
        </button>

        <form className="signup_form">
          <div className="signup_input_container">
            <input type="email" className="email_input input" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="button" className="email_duplicheck">
              중복확인
            </button>
          </div>

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

          <div className="signup_input_container">
            <input type="text" className="company_name_input input" placeholder="업체명" value={companyname} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="signup_input_container">
            <input type="text" className="company_address_input input" placeholder="업체 주소" value={companyaddress} onChange={(e) => setPassword(e.target.value)} required />
          </div>

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
