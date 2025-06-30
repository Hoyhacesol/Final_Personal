import React, { useEffect, useRef, useState } from "react";
import { getDialog, sendMessage } from "../api/messageApi";
import styles from "./MessengerPanel.module.css";
import { getProfileImgUrl } from "../api/imageUtil";
import { useAuth } from "../contexts/Authcontext";

const BOT_ROOM = {
  id: "bot",
  name: "킥옥션 챗봇 (Beta)",
  profile: "chatbot.png",
  preview: "챗봇이 도와드릴 준비가 되어 있어요!",
  unread: 0,
  messages: [{ from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }],
};

export default function MessengerPanel({ targetUser, onClose }) {
  const { user } = useAuth();
  const [roomList, setRoomList] = useState([BOT_ROOM]);
  const [selectedId, setSelectedId] = useState("bot");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 선택된 방 객체 반환
  const selectedRoom = roomList.find((r) => r.id === selectedId);

  // 1. 채팅방 목록 초기 로딩 (챗봇 포함)
  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const res = await fetch("/api/messages/rooms", { credentials: "include" });
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        // 서버 반환 DTO를 id/name/profile 일관화
        const mappedRooms = data.map((room) => ({
          id: room.partnerMno, // 반드시!
          name: room.partnerName,
          profile: room.partnerProfileImg,
          preview: room.preview || "",
          unread: room.unread || 0,
          mno: room.partnerMno,
          messages: [], // 최초엔 안 가져옴, 클릭 시 getDialog로
        }));
        setRoomList([BOT_ROOM, ...mappedRooms]);
      } catch (err) {
        setRoomList([BOT_ROOM]);
        console.error("채팅방 목록 불러오기 실패:", err);
      }
    };
    fetchRoomList();
  }, []);

  // 2. 프로필에서 [메시지 보내기]로 방 강제 오픈
  useEffect(() => {
    if (targetUser && targetUser.mno) {
      const id = targetUser.mno;
      // 이미 있는 방이면 해당 방 선택만, 없으면 새 방 생성+선택
      const exists = roomList.some((room) => room.id === id);
      if (!exists) {
        // 메시지 내역 fetch
        getDialog(id).then((msgs) => {
          const newRoom = {
            id,
            mno: id,
            name: targetUser.userName,
            profile: targetUser.profileimg,
            preview: msgs.length > 0 ? msgs[msgs.length - 1].content : "",
            unread: 0,
            messages: msgs.map((m) => ({
              from: (m.senderId || m.sender?.mno) === user.mno ? "me" : "user",
              text: m.content,
              sentAt: m.sentAt,
            })),
          };
          setRoomList((rooms) => [...rooms, newRoom]);
          setSelectedId(id);
        });
      } else {
        setSelectedId(id);
      }
    }
    // roomList도 의존성에 넣어야 함(없으면 방이 바로 추가 안 됨)
    // eslint-disable-next-line
  }, [targetUser, roomList.length]);

  // 3. 채팅방 클릭 시 해당 방 메시지 내역 fetch
  const handleRoomClick = (room) => {
    setSelectedId(room.id);
    if (room.id === "bot") return;
    // 서버에서 해당 상대와의 대화 내역 가져오기
    getDialog(room.id).then((msgs) => {
      setRoomList((rooms) =>
        rooms.map((r) =>
          r.id === room.id
            ? {
                ...r,
                messages: msgs.map((m) => ({
                  from: (m.senderId || m.sender?.mno) === user.mno ? "me" : "user",
                  text: m.content,
                  sentAt: m.sentAt,
                })),
                preview: msgs.length > 0 ? msgs[msgs.length - 1].content : "",
              }
            : r
        )
      );
    });
  };

  // 4. 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || !selectedRoom) return;
    if (selectedRoom.id === "bot") {
      // 챗봇
      const updatedBot = {
        ...selectedRoom,
        messages: [...selectedRoom.messages, { from: "me", text: input }],
        preview: input,
      };
      setRoomList((rooms) => rooms.map((r) => (r.id === "bot" ? updatedBot : r)));
      setInput("");
      // 챗봇 응답
      try {
        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input }),
        });
        const data = await res.json();
        setRoomList((rooms) =>
          rooms.map((r) =>
            r.id === "bot"
              ? {
                  ...r,
                  messages: [...updatedBot.messages, { from: "bot", text: data.reply }],
                  preview: data.reply,
                }
              : r
          )
        );
      } catch {
        setRoomList((rooms) =>
          rooms.map((r) =>
            r.id === "bot"
              ? {
                  ...r,
                  messages: [...updatedBot.messages, { from: "bot", text: "오류가 발생했습니다." }],
                  preview: "오류가 발생했습니다.",
                }
              : r
          )
        );
      }
    } else {
      // 유저 쪽지 전송
      const msg = await sendMessage(selectedRoom.id, input);
      setRoomList((rooms) =>
        rooms.map((r) =>
          r.id === selectedRoom.id
            ? {
                ...r,
                messages: [...(r.messages || []), { from: "me", text: msg.content, sentAt: msg.sentAt }],
                preview: msg.content,
              }
            : r
        )
      );
      setInput("");
    }
  };

  // 5. 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRoom?.messages]);

  // 6. 방 클릭/추가 시 대화내역 없으면 기본 안내
  const showMessages = selectedRoom?.messages?.length > 0;

  return (
    <div className={styles.messenger_panel}>
      <div className={styles.messenger_header}>
        <span>💬 MomoTalk</span>
        <button className={styles.close_btn} onClick={onClose}>
          ×
        </button>
      </div>
      <div className={styles.messenger_body}>
        <div className={styles.messenger_list}>
          {roomList.map((room) => (
            <div key={room.id} className={styles.messenger_list_item + (room.id === selectedId ? ` ${styles.selected}` : "")} onClick={() => handleRoomClick(room)}>
              <img src={getProfileImgUrl(room.profile || "baseprofile.png")} className={styles.profile_thumb} alt={room.name} />
              <div className={styles.list_info}>
                <div className={styles.messenger_user_name}>{room.name}</div>
                <div className={styles.messenger_preview}>{room.preview}</div>
              </div>
              {room.unread > 0 && <span className={styles.unread_badge}>{room.unread}</span>}
            </div>
          ))}
        </div>
        <div className={styles.messenger_room}>
          <div className={styles.messages_area}>
            {showMessages ? (
              selectedRoom.messages.map((msg, i) => (
                <div key={i} className={msg.from === "me" ? styles.message_bubble_me : styles.message_bubble_you}>
                  {msg.from !== "me" && (
                    <div className={styles.speaker_area}>
                      <img src={getProfileImgUrl(selectedRoom.profile || "baseprofile.png")} className={styles.message_profile_thumb} alt={selectedRoom.name} />
                      <span className={styles.speaker_name}>{selectedRoom.name}</span>
                    </div>
                  )}
                  <span className={styles.message_text}>{msg.text}</span>
                  {msg.sentAt && <div className={styles.message_time}>{new Date(msg.sentAt).toLocaleTimeString()}</div>}
                </div>
              ))
            ) : (
              <div className={styles.no_message}>아직 대화가 없습니다.</div>
            )}
            {/* 스크롤 기준점 */}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.input_row}>
            <input className={styles.chat_input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="메시지 입력" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            <button className={styles.send_btn} onClick={handleSend}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
