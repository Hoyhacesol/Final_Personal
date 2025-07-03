import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { getSellerRegisterInfo, getSellerRegistered } from "../../api/SellerApi";
import "../../css/Sharesheet.css";
import styles from "../mypage/MyPage.module.css";

const MyPage = () => {
  const { user, setUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showinputModal, setShowinputModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [newSname, setNewSname] = useState("");
  const [newSlocation, setNewSlocation] = useState("");
  const [prevAddress, setPrevAddress] = useState("");
  const [hasTempAddress, setHasTempAddress] = useState(false);
  const [agree, setAgree] = useState("");
  const [requestCounts, setRequestCounts] = useState({ ongoing: 0, completed: 0 });
  const [bizCount, setBizCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("[MyPage] 현재 로그인된 사용자:", user);
    const fetchCompanyInfo = async () => {
      if (!user?.mno || user.role !== "SELLER") return;

      try {
        const [basicInfo, registered] = await Promise.all([getSellerRegisterInfo(user.mno), getSellerRegistered()]);

        setCompany({
          sname: basicInfo.sname,
          slocation: basicInfo.slocation,
        });
        setIsRegistered(registered);
      } catch (err) {
        console.error("업체 기본 정보 또는 등록 여부 조회 실패", err);
      }
    };

    fetchCompanyInfo();
  }, [user?.mno]);

  // 주석: 내정보탭- 진행중/완료된 견적 수 가져옴
  useEffect(() => {
    const fetchRequestCounts = async () => {
      try {
        const res = await fetch(`/api/members/${user.mno}/request-counts`);
        const data = await res.json();
        setRequestCounts(data);
      } catch (err) {
        console.error("견적 개수 가져오기 실패", err);
      }
    };

    if (user) fetchRequestCounts();
  }, [user]);

  // 주석: seller회원->biz수 불러옴
  useEffect(() => {
    const fetchBizCount = async () => {
      try {
        const res = await fetch(`/api/members/${user.mno}/biz-count`);
        if (!res.ok) throw new Error("서버 오류");

        const data = await res.json();
        setBizCount(data.count || 0);
      } catch (err) {
        console.error("입찰 수 불러오기 실패", err);
        setBizCount(0);
      }
    };

    if (user?.role === "SELLER") fetchBizCount();
  }, [user]);

  if (!user) return <p>비정상적인 접근입니다. 로그인 상태를 확인하세요.</p>;

  // 주석: ROLE변경
  const handleRoleToggle = async () => {
    if (user.role === "USER") {
      // user에서 seller로
      try {
        const res = await axios.get(`http://localhost:8080/api/members/checkseller`, {
          params: { mno: user.mno },
        });

        if (res.data.exists) {
          // 기존 seller데이터 존재
          await axios.patch("http://localhost:8080/api/members/changetoseller", null, {
            params: {
              mno: user.mno,
            },
          });
          alert("판매 업체로 변경되셨습니다.");
          navigate(0);
        } else {
          // seller데이터 없음
          setShowinputModal(true);
        }
      } catch (err) {
        alert("변경 실패");
      }
    } else {
      // seller에서 user로
      await axios.patch("http://localhost:8080/api/members/changetouser", null, {
        params: {
          mno: user.mno,
        },
      });
      alert("일반 유저로 변경되셨습니다.");
      navigate(0);
    }
  };

  // modal에서 업체 데이터 제출
  const handleSubmitSellerInfo = async () => {
    if (!newSname || !newSlocation) {
      return alert("이 항목은 비울 수 없습니다.");
    }

    try {
      await axios.patch("http://localhost:8080/api/members/changetoseller", null, {
        params: {
          mno: user.mno,
          sname: newSname,
          slocation: newSlocation,
        },
      });
      alert("판매 업체로 변경되셨습니다.");
      setShowinputModal(false);
      navigate(0);
    } catch (err) {
      alert("전환 실패: " + err.message);
    }
  };

  // 주석: 주소선택
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setPrevAddress(newSlocation);
        setNewSlocation(data.address);
        setHasTempAddress(true);
      },
    }).open();
  };

  const handleCancelAddress = () => {
    setNewSlocation(prevAddress);
    setHasTempAddress(false);
  };

  // 주석: 회원탈퇴 모달
  const handleSubmitWithdraw = async () => {
    try {
      const res = await axios.delete(`/api/members/${user.mno}`);
      if (res.status === 200) {
        alert("회원탈퇴가 완료되었습니다.");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      alert("탈퇴 중 알 수 없는 오류..");
    }
  };

  return (
    <div className={styles.mypage_container}>
      <div className={styles.mypage_header}>
        <h2 className={styles.mypage_title}>마이페이지</h2>
        {user.role === "USER" && (
          <button className={styles.role_change_button} onClick={handleRoleToggle}>
            ↺ ㅤ업체로 전환하기
          </button>
        )}
        {user.role === "SELLER" && (
          <button className={styles.role_change_button} onClick={handleRoleToggle}>
            ↺ ㅤ 일반 유저로 전환하기
          </button>
        )}
      </div>

      {/* ROLE 최초 변경시 SELLER필요데이터 입력MODAL */}
      {showinputModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_container}>
            <h3>업체 정보 입력</h3>
            <input type="text" placeholder="업체명" value={newSname} onChange={(e) => setNewSname(e.target.value)} />
            <div className={`${styles.signup_input_container} ${styles.address_input_wrapper}`}>
              <input type="text" className={styles.company_address_input} placeholder="업체 주소" value={newSlocation} readOnly required />
              <div className={styles.button_row}>
                <button type="button" className={styles.address_search_button} onClick={handleAddressSearch} aria-label="주소 검색">
                  <FaSearchLocation style={{ marginRight: "3px" }} /> 주소 찾기
                </button>
                {hasTempAddress && (
                  <button type="button" className={styles.address_cancel_button} onClick={handleCancelAddress}>
                    취소
                  </button>
                )}
              </div>
            </div>
            <div className={styles.modal_buttons}>
              <button onClick={handleSubmitSellerInfo}>등록</button>
              <button onClick={() => setShowinputModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      <hr className={styles.title_divider} />

      {/* 회원 정보 */}
      <section className={styles.mypage_section}>
        <h3 className={styles.section_title}>내 정보</h3>

        {/* 프사 */}
        <div className={styles.profile_image_wrapper}>
          <img key={user.profileimg} src={`http://localhost:8080/images/${user.profileimg || "baseprofile.png"}?t=${new Date().getTime()}`} alt="프로필 이미지" className={styles.profile_image} />
        </div>
        <div className={styles.myinfo_wrapper}>
          <p className={styles.user_name}>
            <strong>{user.nickname}</strong> 님{user.role === "USER" && <span className={`${styles.role_badge} ${styles.badge_user}`}>일반 유저</span>}
            {user.role === "SELLER" && <span className={`${styles.role_badge} ${styles.badge_seller}`}>업체 유저</span>}
            {user.role === "ADMIN" && <span className={`${styles.role_badge} ${styles.badge_admin}`}>운영진</span>}
            <br />
            <span className={styles.user_email}>({user.user_id})</span>
          </p>
          <Link to={user.social === 0 ? "/updateinfosocial" : "/updateinfo"}>
            <button className={styles.update_button}>회원정보 수정</button>
          </Link>
        </div>
      </section>
      <hr className={styles.section_divider} />

      {/* 견적 정보 */}
      <section className={styles.mypage_section}>
        <div className={styles.myrequest_wrapper}>
          <h3 className={styles.section_title}>내 견적</h3>
          <div className={styles.request_info_container}>
            <div className={styles.request_texts}>
              {user?.role === "SELLER" ? (
                <p className={styles.request_info}>
                  지금까지 킥옥션과 함께 <strong className={styles.textcolor2}>{bizCount}</strong>번 입찰하셨어요!
                </p>
              ) : (
                <>
                  <p className={styles.request_info}>
                    현재 <strong className={styles.textcolor1}>{requestCounts.ongoing}</strong> 개의 의뢰를 모집 중이고,
                  </p>
                  <p className={styles.request_info}>
                    지금까지 <strong className={styles.textcolor2}>{requestCounts.total}</strong> 번 킥옥션을 사용해 주셨어요!
                  </p>
                </>
              )}
            </div>
            {user?.role === "SELLER" ? (
              <button className={styles.request_info_button} onClick={() => navigate("/orderlist")}>
                신규 견적목록
              </button>
            ) : (
              <button className={styles.request_info_button} onClick={() => navigate("/request/list")}>
                견적 상세정보
              </button>
            )}
          </div>
        </div>
      </section>
      <hr className={styles.section_divider} />

      {/* 업체 정보 (SELLER 전용) */}
      {user?.role === "SELLER" && (
        <section className={styles.mypage_section}>
          <div className={styles.mycomp_wrapper}>
            <h3 className={styles.section_title}>내 업체 정보</h3>
            <div className={styles.mycomp_container}>
              {company ? (
                <div className={styles.company_infos}>
                  <p className={styles.company_name}>
                    {" "}
                    <strong>{company.sname}</strong>
                  </p>
                  <p className={styles.company_address}> {company.slocation}</p>
                </div>
              ) : (
                <p className={styles.company_no}> 등록된 업체가 없습니다.</p>
              )}

              {isRegistered ? (
                //수정 버튼 활성화
                <Link to="/sellermodify">
                  <button className={styles.comp_info_button}>업체정보 수정</button>
                </Link>
              ) : (
                <Link to="/sellerList/register">
                  <button className={styles.comp_info_button}>업체정보 등록</button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 회원정보 찾기 / 회원가입 */}
      <div className={styles.mypage_help}>
        <Link to="/help">고객센터</Link>
        <span className={styles.help_separator}>|</span>
        <button type="button" className={styles.withdraw_link} onClick={() => setShowWithdrawModal(true)}>
          회원탈퇴
        </button>
      </div>

      {/* 회원탈퇴 정보 MODAL */}
      {showWithdrawModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_container}>
            <h3 className={styles.withdraw_title}>회원탈퇴</h3>
            <p className={styles.withdraw_p}>탈퇴 시 계정 및 관련 데이터가 모두 삭제되며 복구할 수 없습니다.</p>
            <p className={styles.withdraw_p}>
              아래 입력란에 <strong>확인했습니다</strong> 를 정확히 입력해주세요.
            </p>
            <input type="text" placeholder="확인했습니다" value={agree} onChange={(e) => setAgree(e.target.value)} />
            <div className={styles.modal_buttons}>
              <button onClick={handleSubmitWithdraw} disabled={agree !== "확인했습니다"} className={agree === "확인했습니다" ? styles.active_btn : styles.disabled_btn}>
                탈퇴
              </button>
              <button onClick={() => setShowWithdrawModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
