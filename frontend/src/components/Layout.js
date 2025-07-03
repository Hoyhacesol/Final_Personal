import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import Chattingicon from "./Chatting";
import MessengerPanel from "./MessengerPanel";
import { useAuth } from "../contexts/Authcontext";
import MessengerPanelMobile from "./MessengerPanelMobile";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // 주석: 모바일 미확인 메세지 카운팅
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/messages/unread/total", {
          credentials: "include",
        });
        const count = await res.json();
        setUnreadCount(count);
      } catch (err) {
        console.error("읽지 않은 메시지 개수 불러오기 실패:", err);
      }
    };

    if (!chatOpen) {
      fetchUnreadCount();
    }
  }, [chatOpen]);

  // 주석: Chatting.js 눌렀을댸 채티방열기
  const openMessengerWithUser = (user) => {
    setChatTarget(user);
    setChatOpen(true);
  };

  return (
    <>
      <Nav onChatClick={() => setChatOpen((prev) => !prev)} chatOpen={chatOpen} unreadCount={unreadCount} />
      <div id="wrap">
        <Outlet context={{ openMessengerWithUser }} />
      </div>
      {user && !chatOpen && <Chattingicon onClick={() => setChatOpen(true)} />}
      {chatOpen && (window.innerWidth <= 768 ? <MessengerPanelMobile onClose={() => setChatOpen(false)} /> : <MessengerPanel onClose={() => setChatOpen(false)} />)}
      <Footer />
    </>
  );
};

export default Layout;
