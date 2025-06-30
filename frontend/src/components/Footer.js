import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../assets/img/logo_v2.png";

const Footer = () => {
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscriptionMsg, setSubscriptionMsg] = useState("");
  const navItems = [
    { path: "/request", label: "견적 요청" },
    { path: "/orderlist", label: "견적 목록" },
    { path: "/sellerlist", label: "등록된 업체 목록" },
    { path: "/community", label: "자유게시판" },
    { path: "/help", label: "고객센터" },
  ];

  const handleSubscribe = async e => {
    e.preventDefault();
    if (!newsletterEmail) {
      setSubscriptionMsg("이메일을 입력해주세요.");
      return;
    }
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail })
    });
    const text = await res.text();
    if (res.ok) {
      setSubscriptionMsg("구독 확인 메일을 발송했습니다.");
      setNewsletterEmail("");
    } else {
      setSubscriptionMsg(`오류: ${text}`);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_column}>
          <Link to="/" className={styles.footer_logo}>
            <img src={logo} alt="KickAuction 로고" />
          </Link>
          <p className={styles.brand_tagline}>빠르고 간편한 풋살 장비 렌탈 역경매 서비스</p>
          <p className={styles.brand_slogan}>최저가를 향한 킥, 바로 여기서 시작!</p>
        </div>

        <div className={styles.footer_column}>
          <h4 className={styles.column_title}>서비스</h4>
          <ul className={styles.link_list}>
            {navItems.map((item) => (
              <li
                key={item.path}
                className={location.pathname.startsWith(item.path) ? styles.active : ""}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer_column}>
          <h4 className={styles.column_title}>고객지원</h4>
          <p>이메일: kickauction8@gmail.com</p>
          <p>전화: 02-1234-5678</p>
          <p>운영시간: 09:00–18:00 (월–금)</p>
        </div>

        <div className={styles.footer_column}>
          <h4 className={styles.column_title}>팔로우하기</h4>
          <div className={styles.social_icons}>
            <a href="#" aria-label="페이스북"><i className="icon-facebook" /></a>
            <a href="#" aria-label="인스타그램"><i className="icon-instagram" /></a>
            <a href="#" aria-label="유튜브"><i className="icon-youtube" /></a>
          </div>
          <form className={styles.newsletter_form} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="이메일 입력"
              className={styles.newsletter_input}
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className={styles.newsletter_button}>
              구독
            </button>
          </form>
          {subscriptionMsg && (
            <p className={styles.subscription_msg}>{subscriptionMsg}</p>
          )}
        </div>
      </div>

      <div className={styles.footer_legal}>
        <ul className={styles.legal_links}>
          <li><Link to="/help">이용약관</Link></li>
          <li><Link to="/help">개인정보처리방침</Link></li>
        </ul>
        <p>© 2025 KickAuction. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
