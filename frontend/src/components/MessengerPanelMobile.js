import React, { useEffect, useState } from "react";
import ChatRoomList from "./ChatRoomList";
import MobileChatRoom from "./MobileChatRoom";
import NewChatModalMobile from "./NewChatModalMobile";
import { getProfileImgUrl } from "../api/imageUtil";
import "./MessengerPanelMobile.css";

const MessengerPanelMobile = ({ onClose }) => {
  const [view, setView] = useState("list"); // "list" or "chat"
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // 채팅방 목록 최초 불러오기
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/messages/rooms", {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (err) {
        console.error("채팅방 목록 로드 실패", err);
      }
    };

    fetchRooms();
  }, []);

  // 기존 채팅방 클릭
  const openChatRoom = (room) => {
    setCurrentRoom(room);
    setView("chat");
  };

  // 새로운 채팅 시작
  const handleUserSelected = async (userData) => {
    const targetId = userData.mno;

    const existingRoom = rooms.find((r) => r.partnerMno === targetId);
    if (existingRoom) {
      // 이미 있는 방이면 바로 전환
      setCurrentRoom(existingRoom);
      setView("chat");
      return;
    }

    try {
      const res = await fetch(`/api/messages/dialog?target=${targetId}`, {
        credentials: "include",
      });
      const messages = await res.json();

      const newRoom = {
        partnerMno: targetId,
        partnerName: userData.user_name,
        partnerProfileImg: userData.profileimg,
        lastMessage: messages.length > 0 ? messages[messages.length - 1].content : "",
        unreadCount: 0,
      };

      setRooms((prev) => [...prev, newRoom]);
      setCurrentRoom(newRoom);
      setView("chat");

      await refreshRooms();
    } catch (err) {
      alert("대화 불러오기 실패");
    }
  };

  // 채팅보내고 정렬초기화
  const refreshRooms = async () => {
    try {
      const res = await fetch("/api/messages/rooms", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRooms(data);
      }
    } catch (err) {
      console.error("채팅방 목록 갱신 실패", err);
    }
  };

  return (
    <div className="mobile-messenger-panel">
      {view === "list" && (
        <>
          <ChatRoomList rooms={rooms} onRoomClick={openChatRoom} onNewChatClick={() => setShowNewChatModal(true)} onClose={onClose} />
          {showNewChatModal && <NewChatModalMobile onClose={() => setShowNewChatModal(false)} onSelectUser={handleUserSelected} />}
        </>
      )}

      {view === "chat" && (
        <MobileChatRoom
          room={currentRoom}
          onClose={onClose}
          onBack={() => {
            refreshRooms(); // 채팅방 목록 갱신
            setView("list");
          }}
        />
      )}
    </div>
  );
};

export default MessengerPanelMobile;
