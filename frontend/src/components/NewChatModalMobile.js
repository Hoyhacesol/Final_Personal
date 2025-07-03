import React, { useState } from "react";
import "./NewChatModalMobile.css";

const NewChatModalMobile = ({ onClose, onSelectUser }) => {
  const [nickname, setNickname] = useState("");

  const handleSearch = async () => {
    if (!nickname.trim()) return;

    try {
      const res = await fetch(`/api/messages/find-user?nickname=${encodeURIComponent(nickname.trim())}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "해당 닉네임을 찾을 수 없습니다.");
      }

      const userData = await res.json();
      onSelectUser(userData); // 채팅 시작 처리
      setNickname("");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="newchat-overlay">
      <div className="newchat-modal">
        <h3>새로운 채팅방</h3>
        <p>닉네임을 입력해 채팅을 시작하세요</p>
        <input type="text" placeholder="닉네임 입력..." value={nickname} onChange={(e) => setNickname(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <div className="newchat-modal-btns">
          <button className="start-btn" onClick={handleSearch}>
            채팅 시작
          </button>
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModalMobile;
