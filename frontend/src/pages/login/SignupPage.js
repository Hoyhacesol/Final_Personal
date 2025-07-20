import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import styles from "../login/SignupPage.module.css";
import "../../css/Sharesheet.css";
import logo from "../../assets/img/logo_v2.png";

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || ""); //이메일 필드
  const [nickname, setNickname] = useState(""); //닉네임 필드
  const [password, setPassword] = useState(""); //비밀번호 입력 필드
  const [confirmPw, setConfirmPw] = useState(""); //비밀번호 확인 필드
  const [phone, setPhone] = useState(""); //전화번호 필드
  const [resulterror, setResulterror] = useState(""); //결과 오류
  const [emailError, setEmailError] = useState(""); //이메일 에러
  const [nicknameStatus, setNicknameStatus] = useState(null); //닉네임 에러
  const [pwStatus, setPwStatus] = useState(null); //비밀번호 에러
  const [pw2Error, setPw2Error] = useState(""); //비밀번호 확인 에러
  const [isModalOpen, setIsModalOpen] = useState(false); //문자인증 모달
  const [authCode, setAuthCode] = useState(""); //문자인증 검증값
  const [timer, setTimer] = useState(180); //문자인증 제한시간
  const timerRef = useRef(null); //문자인증 제한시간 추적-초기화
  const [isVerified, setIsVerified] = useState(false); //문자인증 통과여부
  const [verifyStatus, setVerifyStatus] = useState(null); //문자인증 에러

  // ////////////////////////////////////////////////테스트용 인증무시 추후삭제필요///////////////////////////////////////////////////////////////////
  const noVerify = () => {
    alert("backdoor_인증완료처리");
    setIsVerified(true);
    setVerifyStatus("success");
  };

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
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~-]{4,15}$/;
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
    const numbersOnly = value.replace(/\D/g, ""); // 주석: 숫자 외 입력값 자동제거

    if (numbersOnly.length <= 3) {
      return numbersOnly;
    } else if (numbersOnly.length <= 7) {
      return numbersOnly.slice(0, 3) + "-" + numbersOnly.slice(3);
    } else {
      return numbersOnly.slice(0, 3) + "-" + numbersOnly.slice(3, 7) + "-" + numbersOnly.slice(7, 11);
    }
  };

  //주석: 문자인증 타이머
  const startTimer = () => {
    let count = 180;
    timerRef.current = setInterval(() => {
      count -= 1;
      setTimer(count);

      if (count <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsModalOpen(false);
        alert("인증 시간이 만료되었습니다.");
      }
    }, 1000);
  };

  // 주석: 문자인증
  const handleSendSMS = async () => {
    // 주석: 인증x인 상태에서만 가능
    if (verifyStatus === "success") {
      alert("이미 인증에 성공하셨습니다.");
      return;
    }

    clearInterval(timerRef.current); //주석:이전 타이머 제거
    timerRef.current = null;

    const cleanedPhone = phone.replace(/-/g, ""); // 주석: 하이픈(-) 제거

    if (!/^010\d{8}$/.test(cleanedPhone)) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/sms/send",
        {
          phone: cleanedPhone,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsModalOpen(true);
        setTimer(180); // 주석: 타이머 시간
        startTimer();
      }
    } catch (err) {
      alert("인증번호 전송에 실패했습니다.");
    }
  };

  // 주석: 문자인증 모달에서 값 제출
  const handleVerifySMS = async () => {
    const cleanPhone = phone.replace(/-/g, "");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/sms/verify",
        {
          phone: cleanPhone,
          code: authCode,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsVerified(true);
        setVerifyStatus("success");
        setIsModalOpen(false);
      }
    } catch (e) {
      alert("인증번호가 일치하지 않습니다.");
      setIsVerified(false);
      setVerifyStatus("fail");
    }
  };

  //모달 닫기
  const handleCloseModal = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsModalOpen(false);
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhone(formatted);

    setIsVerified(false);
    setVerifyStatus(null);
  };

  // 주석: 회원가입 처리 (api/members/signup 매핑, 위의 모든 검증과정 통과해야 동작함)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResulterror("");

    if (nicknameStatus !== "valid") {
      setResulterror("닉네임 중복체크가 완료되지 않았어요.");
      return;
    }

    if (pwStatus !== "valid") {
      setResulterror("비밀번호 형식이 올바르지 않아요.");
      return;
    }
    if (confirmPw !== password) {
      setResulterror("비밀번호가 일치하지 않아요.");
      return;
    }

    if (!isVerified) {
      setResulterror("전화번호 인증을 완료해주세요.");
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
    <div className={styles.signup_container}>
      <div className={styles.signup_smallcontainer}>
        {/* 로고 */}
        <Link to="/">
          <img src={logo} alt="킥옥션 로고" className={styles.signup_logo} />
        </Link>
        <h2 className={styles.signup_title}>일반 유저 회원가입</h2>

        {/* 전환 버튼 */}
        <div className={styles.change_toseller}>
          <Link to="/presignupseller">＃ 장비 대여·판매 업체로 가입하시겠어요?</Link>
        </div>

        <form className={styles.signup_form} onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div className={styles.signup_input_container}>
            <input
              type="email"
              className={`${styles.email_input} ${styles.input}`}
              placeholder="이메일"
              value={email}
              readOnly
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
          </div>

          {emailError && <p className={styles.error}>{emailError}</p>}

          {/* 닉네임 */}
          <div className={styles.signup_input_container}>
            <input
              type="text"
              className={`${styles.nickname_input} ${styles.input} ${styles[nicknameStatus] || ""}`}
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameStatus(null);
              }}
            />
            <button type="button" className={styles.nickname_duplicheck} onClick={handleNicknameCheck}>
              중복확인
            </button>
          </div>

          {nicknameStatus === "duplicate" && <p className={styles.error}>❌ 이미 입력된 닉네임이 존재합니다.</p>}
          {nicknameStatus === "valid" && <p className={`${styles.nickname_ok} ${styles.error}`}>✔ 사용 가능한 닉네임입니다.</p>}
          {nicknameStatus === "error" && <p className={styles.error}> 중복확인 중 오류가 발생했습니다.</p>}

          {/* 비밀번호 & 비밀번호 확인     */}
          <div className={styles.signup_input_container}>
            <input type="password" className={`${styles.password_input} ${styles.input} ${styles[pwStatus] || ""}`} placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
          </div>

          {pwStatus === "invalid" && <p className={styles.error}>❗ 비밀번호는 4~15자이며, 영문과 숫자를 모두 포함해야 합니다.</p>}
          {pwStatus === "valid" && <p className={`${styles.error} ${styles.password_ok}`}>✔ 비밀번호는 4~15자이며, 영문과 숫자를 모두 포함해야 합니다.</p>}

          <div className={styles.signup_input_container}>
            <input
              type="password"
              className={`${styles.password_check_input} ${styles.input} ${confirmPw ? (confirmPw === password ? styles.valid : styles.invalid) : ""}`}
              placeholder="비밀번호 재입력"
              value={confirmPw}
              onChange={handleConfirmPwChange}
            />
          </div>

          {pw2Error && <p className={`${styles.password_check_message} ${confirmPw === password ? `${styles.error} ${styles.pw2_ok}` : styles.error}`}>{pw2Error}</p>}

          {/* 전화번호 입력 및 인증 */}
          <div className={styles.signup_input_container}>
            <input
              type="tel"
              className={`${styles.tel_input} ${styles.input}`}
              placeholder="본인 명의의 전화번호만 가능합니다."
              value={phone}
              onChange={handlePhoneChange}
              maxLength={13}
              onKeyDown={(e) => {
                if (e.key === "F7" && e.shiftKey) {
                  e.preventDefault();
                  noVerify();
                }
              }}
            />
            <button type="button" className={styles.check_button} onClick={handleSendSMS}>
              인증받기
            </button>
          </div>

          {verifyStatus === "success" && <p className={`${styles.error} ${styles.sms_ok}`}>✔ 인증 완료</p>}
          {verifyStatus === "fail" && <p className={styles.error}>❗ 인증되지 않음</p>}

          {/* 인증 모달 */}
          {isModalOpen && (
            <div className={styles.modal_overlay}>
              <div className={styles.modal_container}>
                <h3>인증번호 확인</h3>
                <p>입력하신 번호로 SMS 인증번호가 전송되었습니다.</p>
                <p className={styles.timer}>
                  남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                </p>

                <input type="text" maxLength={6} placeholder="인증번호 6자리" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className={styles.auth_input} />

                <div className={styles.modal_buttons}>
                  <button type="button" className={styles.modal_button} onClick={handleVerifySMS}>
                    확인
                  </button>
                  <button type="button" className={`${styles.modal_button} ${styles.cancel}`} onClick={handleCloseModal}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 결과 오류 및 제출 */}
          <p key={resulterror} className={`${styles.login_error} ${resulterror ? styles.show : ""}`}>
            {resulterror || " "}
          </p>

          <button type="submit" className={styles.login_button}>
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
