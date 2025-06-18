import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../login/SignupPage.css";
import logo from "../../assets/img/kickauction_logo.png";

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [resulterror, setResulterror] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState(null);
  const [pwError, setPwError] = useState("");
  const [pwStatus, setPwStatus] = useState(null);
  const [pw2Error, setPw2Error] = useState("");

  //주석: 이메일 적합 검사
  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  // 주석: 닉네임 중복확인
  const handleNicknameCheck = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/members/nickname_check?nickname=${encodeURIComponent(nickname)}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.exists) {
        setNicknameStatus("duplicate");
      } else {
        setNicknameStatus("valid");
      }
    } catch (error) {
      setNicknameStatus("error");
    }
  };

  // 주석: 비밀번호 적합성 검사
  const validatePassword = (pw) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,15}$/;
    return regex.test(pw);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value === "") {
      setPwStatus(null);
    } else if (validatePassword(value)) {
      setPwStatus("valid");
    } else {
      setPwStatus("invalid");
    }
  };

  // 주석: 비밀번호 일치 검사
  const handleConfirmPwChange = (e) => {
    const value = e.target.value;
    setConfirmPw(value);

    if (value === "") {
      setPw2Error("");
    } else if (value !== password) {
      setPw2Error("비밀번호가 일치하지 않습니다.");
    } else {
      setPw2Error("✔ 비밀번호 일치");
    }
  };

  //주석: 핸드폰 번호 하이픈 자동 입력
  const formatPhoneNumber = (value) => {
    // 숫자 외 x
    const numbersOnly = value.replace(/\D/g, "");

    if (numbersOnly.length <= 3) {
      return numbersOnly;
    } else if (numbersOnly.length <= 7) {
      return numbersOnly.slice(0, 3) + "-" + numbersOnly.slice(3);
    } else {
      return numbersOnly.slice(0, 3) + "-" + numbersOnly.slice(3, 7) + "-" + numbersOnly.slice(7, 11);
    }
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhone(formatted);
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
        <button type="button" className="change_toseller" onClick={() => navigate("/presignups")}>
          ↩ ㅤ업체 가입하기
        </button>

        <form className="signup_form" onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div className="signup_input_container">
            <input
              type="email"
              className="email_input input"
              placeholder="이메일"
              value={email}
              readOnly
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            />
          </div>

          {emailError && <p className="error">{emailError}</p>}

          {/* 닉네임 */}
          <div className="signup_input_container">
            <input
              type="text"
              className={`nickname_input input ${nicknameStatus}`}
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameStatus(null);
              }}
              required
            />
            <button type="button" className="nickname_duplicheck" onClick={handleNicknameCheck}>
              중복확인
            </button>
          </div>

          {nicknameStatus === "duplicate" && <p className="error">❌ 이미 입력된 닉네임이 존재합니다.</p>}
          {nicknameStatus === "valid" && <p className="nickname_ok error">✔ 사용 가능한 닉네임입니다.</p>}
          {nicknameStatus === "error" && <p className="error">⚠ 중복확인 중 오류가 발생했습니다.</p>}

          {/* 비밀번호 & 비밀번호 확인     */}
          <div className="signup_input_container">
            <input type="password" className={`password_input input ${pwStatus}`} placeholder="비밀번호" value={password} onChange={handlePasswordChange} required />
          </div>

          {pwStatus === "invalid" && <p className="error">❗ 비밀번호는 4~15자이며, 영문과 숫자를 모두 포함해야 합니다.</p>}
          {pwStatus === "valid" && <p className="error password_ok">✔ 비밀번호는 4~15자이며, 영문과 숫자를 모두 포함해야 합니다.</p>}

          <div className="signup_input_container">
            <input
              type="password"
              className={`password_check_input input ${confirmPw && confirmPw === password ? "valid" : confirmPw && confirmPw !== password ? "invalid" : ""}`}
              placeholder="비밀번호 재입력"
              value={confirmPw}
              onChange={handleConfirmPwChange}
              required
            />
          </div>

          {pw2Error && <p className={`password_check_message ${confirmPw === password ? "error pw2_ok" : "error"}`}>{pw2Error}</p>}

          {/* 전화번호 입력 및 인증 */}
          <div className="signup_input_container">
            <input type="tel" className="tel_input input" placeholder="본인 명의의 전화번호만 가능합니다." value={phone} onChange={handlePhoneChange} maxLength={13} required />
            <button type="button" className="check_button">
              인증받기
            </button>
          </div>

          {/* 결과 오류 및 제출 */}
          <p className="error login_error">{resulterror || " "}</p>

          <button type="submit" className="login_button">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
