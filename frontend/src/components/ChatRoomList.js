import React, { useEffect, useState } from "react";
import "./ChatRoomList.css";
import { formatTime } from "../api/dateUtil";
import { getProfileImgUrl } from "../api/imageUtil";
import "../css/Sharesheet.css";

const ChatRoomList = ({ rooms, onRoomClick, onNewChatClick, onClose }) => {
  return (
    <div className="chat-room-list">
      <div className="chat-room-header">
        <div className="chat-room-title">KickTalk</div>
        <div className="chatroom-list-buttons">
          <button className="chat-room-newchat" onClick={onNewChatClick}>
            + 새 채팅
          </button>
          <button className="closebtn" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
      {rooms.map((room) => (
        <div key={room.partnerMno} className="chat-room-item" onClick={() => onRoomClick(room)}>
          <img src={getProfileImgUrl(room.partnerProfileImg)} className="chat-room-avatar" alt={room.partnerName} />
          <div className="chat-room-info">
            <span className="chat-room-name">{room.partnerName}</span>
            <span className="chat-room-preview">{room.lastMessage}</span>
          </div>
          {room.unreadCount > 0 && <span className="chat-room-unread">{room.unreadCount}</span>}
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
