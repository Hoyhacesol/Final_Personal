import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../login/Findinfo.css";
import "../../css/Sharesheet.css";

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
  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);

  // ////////////////////////////////////////////////테스트용 인증무시 추후삭제필요///////////////////////////////////////////////////////////////////
  const noVerify = () => {
    alert("backdoor_인증완료처리");
    setIsVerified(true);
    setVerifyStatus("success");
  };

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

  // 핸드폰번호 입력 변화시 초기화
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhone(formatted);

    setIsVerified(false);
    setVerifyStatus(null);
  };

  // 주석: 문자인증
  const handleSendSMS = async () => {
    const phoneOnly = phone.replace(/-/g, "");
    if (!/^010-\d{4}-\d{4}$/.test(phone)) return alert("올바른 전화번호를 입력하세요.");

    // 주석: 이메일+전화번호 매칭 확인
    if (activeTab === "findPw") {
      try {
        const res = await axios.get(`/api/members/emaillink_check?email=${email}&phone=${phoneOnly}`);
        if (!res.data.match) {
          alert("해당 데이터들에 매칭되는 회원 정보를 찾을 수 없습니다.");
          return;
        }
      } catch (err) {
        alert("이메일/전화번호 확인 중 오류가 발생했습니다.");
        return;
      }
    }

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

  //모달 닫기
  const handleCloseModal = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsModalOpen(false);
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
              <input
                type="tel"
                className="input"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                required
                onKeyDown={(e) => {
                  if (e.key === "F7" && e.shiftKey) {
                    e.preventDefault();
                    noVerify();
                  }
                }}
              />
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
              <input
                type="tel"
                className="input"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                required
                onKeyDown={(e) => {
                  if (e.key === "F7" && e.shiftKey) {
                    e.preventDefault();
                    noVerify();
                  }
                }}
              />
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
                <p>입력하신 번호로 SMS 인증번호가 전송되었습니다.</p>
                <p className="timer">
                  남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                </p>

                <input type="text" maxLength={6} placeholder="인증번호 6자리" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className="auth_input" />
                <div className="modal_buttons">
                  <button type="button" className="modal_button" onClick={handleVerifySMS}>
                    확인
                  </button>
                  <button type="button" className="modal_button cancel" onClick={handleCloseModal}>
                    닫기
                  </button>
                </div>
              </>
            )}
            {modalType === "showId" && (
              <>
                <h3>찾은 이메일</h3>
                <p>{foundEmail}</p>
                <button className="modal_ok" onClick={() => setIsModalOpen(false)}>
                  닫기
                </button>
              </>
            )}
            {modalType === "resetPw" && (
              <>
                <h3>새 비밀번호 설정</h3>
                <input
                  type="password"
                  className="newpw_input"
                  placeholder="새 비밀번호"
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                    setPwStatus(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{4,15}$/.test(e.target.value) ? "valid" : "invalid");
                  }}
                />
                {pwStatus === "invalid" && <p className="error">비밀번호는 4~15자이며, 영문과 숫자를 모두 포함해야 합니다.</p>}
                <input
                  type="password"
                  className="newpw_input"
                  placeholder="비밀번호 확인"
                  value={confirmPw}
                  onChange={(e) => {
                    setConfirmPw(e.target.value);
                    setPw2Error(e.target.value === newPw ? "" : "비밀번호가 일치하지 않습니다.");
                  }}
                />
                {pw2Error && <p className="error">{pw2Error}</p>}
                <button className="modal_ok" onClick={handleResetPassword}>
                  비밀번호 변경
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Findinfo;
