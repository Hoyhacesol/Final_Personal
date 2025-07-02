import React, { useEffect, useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import styles from "./MessengerPanel.module.css";

function Chatting({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

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
    fetchUnreadCount();
  }, []);

  return (
    <button className={styles.chatting_icon} onClick={onClick}>
      <div style={{ position: "relative" }}>
        <IoChatboxEllipsesOutline className={styles.chat_icon} />
        {unreadCount > 0 && <span className={styles.chat_icon_badge}>{unreadCount}</span>}
      </div>
    </button>
  );
}

export default Chatting;
