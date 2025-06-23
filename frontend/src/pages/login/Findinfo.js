import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../login/Findinfo.css";

function Findinfo() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("findId");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [authCode, setAuthCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [timer, setTimer] = useState(180);
  const [timerRef, setTimerRef] = useState(null);

  const [foundEmail, setFoundEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwStatus, setPwStatus] = useState(null);
  const [pw2Error, setPw2Error] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(null); // sms 인증유무

  // 이메일 or 비번 탭 전환시 상태리셋
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setPhone("");
    setEmail("");
    setAuthCode("");
    setPwStatus(null);
    setPw2Error("");
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

  // 주석: 문자인증
  const handleSendSMS = async () => {
    if (!/^010-\d{4}-\d{4}$/.test(phone)) return alert("올바른 전화번호를 입력하세요.");
    try {
      await axios.post("/api/sms/send", { phone: phone.replace(/-/g, "") }, { withCredentials: true });
      setModalType("auth");
      setIsModalOpen(true);
      setTimer(180);
      const ref = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(ref);
            setIsModalOpen(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      setTimerRef(ref);
    } catch {
      alert("SMS 전송 실패");
    }
  };

  const handleVerifySMS = async () => {
    try {
      await axios.post(
        "/api/sms/verify",
        {
          phone: phone.replace(/-/g, ""),
          code: authCode,
        },
        { withCredentials: true }
      );
      clearInterval(timerRef);
      setIsModalOpen(false);

      if (activeTab === "findId") {
        const res = await axios.get(`/api/members/find-id?phone=${phone.replace(/-/g, "")}`);
        setFoundEmail(res.data.email);
        setModalType("showId");
        setIsModalOpen(true);
      } else {
        setModalType("resetPw");
        setIsModalOpen(true);
      }
    } catch {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleResetPassword = async () => {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{4,15}$/.test(newPw)) {
      setPwStatus("invalid");
      return;
    }
    if (newPw !== confirmPw) {
      setPw2Error("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put("/api/members/reset_password", {
        email,
        newPw,
        phone: phone.replace(/-/g, ""),
      });
      alert("비밀번호가 변경되었습니다.");
      setIsModalOpen(false);
      navigate("/login");
    } catch {
      alert("비밀번호 변경 실패");
    }
  };

  return (
    <div className="findinfo_container">
      <h2>ID/PW 찾기</h2>
      <div className="tab_menu">
        <button className={activeTab === "findId" ? "active" : ""} onClick={() => handleTabSwitch("findId")}>
          아이디 찾기
        </button>
        <button className={activeTab === "findPw" ? "active" : ""} onClick={() => handleTabSwitch("findPw")}>
          비밀번호 찾기
        </button>
        <div className="active_line" style={{ transform: activeTab === "findId" ? "translateX(0%)" : "translateX(100%)" }} />
      </div>

      {activeTab === "findId" ? (
        <>
          <div className="input_group">
            <label>전화번호</label>
            <div className="input_row">
              <input type="tel" value={phone} onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} />
              <button onClick={handleSendSMS}>인증받기</button>
            </div>
          </div>
          <button className="main_btn" onClick={handleSendSMS}>
            아이디 찾기
          </button>
        </>
      ) : (
        <>
          <div className="input_group">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input_group">
            <label>전화번호</label>
            <div className="input_row">
              <input type="tel" value={phone} onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} />
              <button onClick={handleSendSMS}>인증받기</button>
            </div>
          </div>
          <button className="main_btn" onClick={handleSendSMS}>
            비밀번호 변경
          </button>
        </>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_container">
            {modalType === "auth" && (
              <>
                <h3>인증번호 확인</h3>
                <p>
                  남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                </p>
                <input type="text" value={authCode} onChange={(e) => setAuthCode(e.target.value)} maxLength={6} />
                <button onClick={handleVerifySMS}>확인</button>
              </>
            )}
            {modalType === "showId" && (
              <>
                <h3>등록된 이메일</h3>
                <p>{foundEmail}</p>
                <button onClick={() => setIsModalOpen(false)}>닫기</button>
              </>
            )}
            {modalType === "resetPw" && (
              <>
                <h3>새 비밀번호 설정</h3>
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                    setPwStatus(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{4,15}$/.test(e.target.value) ? "valid" : "invalid");
                  }}
                />
                {pwStatus === "invalid" && <p className="error">영문+숫자 조합 4~15자</p>}
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPw}
                  onChange={(e) => {
                    setConfirmPw(e.target.value);
                    setPw2Error(e.target.value === newPw ? "" : "비밀번호가 일치하지 않습니다.");
                  }}
                />
                {pw2Error && <p className="error">{pw2Error}</p>}
                <button onClick={handleResetPassword}>비밀번호 변경</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Findinfo;
