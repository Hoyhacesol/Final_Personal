import React, { useState } from "react";
import styles from "./Chatting.module.css";
import ChatBotRoom from "./ChatBotRoom";

function ChattingBox({ onClose }) {
  const [selectedRoom, setSelectedRoom] = useState("bot");
  const [botHistory, setBotHistory] = useState([{ from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    if (room === "bot") {
      setBotHistory([{ from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }]);
    }
    // 유저 쪽지 선택 시는 따로 처리
  };

  return (
    <div className={styles.chat_panel}>
      <button className={styles.close_btn} onClick={onClose}>
        ×
      </button>
      <div className={styles.chat_list}>
        <div className={`${styles.chat_item} ${selectedRoom === "bot" ? styles.selected : ""}`} onClick={() => handleSelectRoom("bot")}>
          킥옥션 챗봇 (Beta)
        </div>
        {/* 아래엔 다른 유저 채팅 아이템 */}
      </div>
      <div className={styles.chat_room}>
        {selectedRoom === "bot" && <ChatBotRoom history={botHistory} setHistory={setBotHistory} />}
        {/* 유저 쪽지는 다른 Room 컴포넌트에서 */}
      </div>
    </div>
  );
}

export default ChattingBox;
