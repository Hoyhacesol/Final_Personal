import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../mypage/Updateinfo.css";
import "../../css/Sharesheet.css";

function UpdateinfoSocial() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [preview, setPreview] = useState("/upload/baseprofile.png");
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [timer, setTimer] = useState(180);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [removeRequested, setRemoveRequested] = useState(false); //프로필사진 삭제 요청
  const timerRef = useRef(null);

  // ////////////////////////////////////////////////테스트용 인증무시 추후삭제필요///////////////////////////////////////////////////////////////////
  const noVerify = () => {
    alert("backdoor_인증완료처리");
    setIsVerified(true);
    setVerifyStatus("success");
  };

  // 현재값 setting
  useEffect(() => {
    if (user) {
      setEmail(user.user_id || "");
      setNickname(user.nickname || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.profileimg) {
      setPreview(`/images/${user.profileimg}`);
    } else {
      setPreview("/images/baseprofile.png");
    }
  }, [user]);

  // 사진 변경
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 기존 사진 삭제
  const handleDeletePhoto = () => {
    setFile(null);
    setPreview("/images/baseprofile.png");
    setRemoveRequested(true);
  };

  // 주석: 닉네임 중복확인
  const handleNicknameCheck = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/members/nickname_check?nickname=${nickname}`);
      if (res.data.exists) {
        setNicknameStatus("duplicate");
      } else {
        setNicknameStatus("valid");
      }
    } catch {
      setNicknameStatus("error");
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
        alert("인증에 성공했습니다.");
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

  // 주석: 수정 요청 처리 (api/members/update 매핑, 위의 모든 검증과정 통과해야 동작함)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nickname !== user.nickname && nicknameStatus !== "valid") return alert("닉네임 중복확인을 해주세요.");
    if (phone !== user.phone && !isVerified) return alert("전화번호 인증을 완료해주세요.");

    const formData = new FormData();
    formData.append("mno", user.mno);
    formData.append("userName", nickname);
    formData.append("phone", phone);

    if (file) {
      formData.append("profileimg", file);
    } else if (removeRequested) {
      formData.append("remove", "true");
    }

    try {
      const res = await axios.put("http://localhost:8080/api/members/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const newProfileImg = res.data.filename || user.profileimg;

      alert("회원 정보가 변경되었어요.");
      setUser({ ...user, nickname, phone, profileimg: newProfileImg });
      window.location.href = "/mypage";
    } catch (err) {
      alert("알 수 없는 오류가 발생했습니다..");
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_smallcontainer">
        <h2 className="signup_title">회원정보 수정</h2>
        <form className="signup_form" onSubmit={handleSubmit}>
          {/* 프로필사진 첨부 */}
          <div className="img_input_container">
            <img
              src={preview}
              alt="프로필 미리보기"
              width="180"
              onError={(e) => {
                e.target.src = "/images/baseprofile.png";
              }}
            />
            <div className="img_buttons">
              <button type="button" onClick={() => fileInputRef.current.click()} style={{ marginRight: "0.5rem" }}>
                사진 변경
              </button>
              <button type="button" className="delete_button" onClick={handleDeletePhoto}>
                사진 삭제
              </button>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          {/* 이메일 */}
          <div className="signup_input_container">
            <input type="email" className="input" value={email} readOnly />
          </div>

          {/* 닉네임 */}
          <div className="signup_input_container">
            <input
              type="text"
              className="input"
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

          {/* 전화번호 수정 */}
          <div className="signup_input_container">
            <input
              type="tel"
              className="input"
              placeholder="본인 명의의 전화번호만 가능합니다."
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
            <button type="button" className="check_button" onClick={handleSendSMS}>
              인증받기
            </button>
          </div>

          {verifyStatus === "success" && <p className="error sms_ok">✔ 인증 완료</p>}
          {verifyStatus === "fail" && <p className="error">❗ 인증되지 않음</p>}

          {/* 인증 모달 */}
          {isModalOpen && (
            <div className="modal_overlay">
              <div className="modal_container">
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
              </div>
            </div>
          )}

          <button type="submit" className="login_button">
            정보 수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateinfoSocial;
