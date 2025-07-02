import React, { useEffect, useRef, useState } from "react";
import { getDialog, sendMessage } from "../api/messageApi";
import styles from "./MessengerPanel.module.css";
import { getProfileImgUrl } from "../api/imageUtil";
import { useAuth } from "../contexts/Authcontext";
import "../css/Sharesheet.css";

const BOT_ROOM = {
  id: "bot",
  name: "킥옥션 챗봇 (Beta)",
  profile: "chatbot.png",
  preview: "안녕하세요! 이렇게 좋은 날, 축구 한 판 어때요?",
  unread: 0,
  messages: [{ from: "bot", text: "안녕하세요! 이렇게 좋은 날, 축구 한 판 어때요?" }],
};

export default function MessengerPanel({ targetUser, onClose }) {
  const { user, setUser } = useAuth();
  const [roomList, setRoomList] = useState([BOT_ROOM]);
  const [selectedId, setSelectedId] = useState("bot");
  const [input, setInput] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchNickname, setSearchNickname] = useState("");
  const messagesEndRef = useRef(null);

  const selectedRoom = roomList.find((r) => r.id === selectedId);

  // 주석: 1. 채팅방 목록 초기 로딩
  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        if (!user || !user.mno) {
          alert("로그인 후 이용 가능합니다.");
          return;
        }

        const res = await fetch("/api/messages/rooms", { credentials: "include" });
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        const mappedRooms = data.map((room) => ({
          id: room.partnerMno,
          name: room.partnerName,
          profile: room.partnerProfileImg,
          preview: room.lastMessage || "",
          mno: room.partnerMno,
          messages: [],
          unread: room.unreadCount || 0,
        }));
        setRoomList([BOT_ROOM, ...mappedRooms]);
      } catch (err) {
        setRoomList([BOT_ROOM]);
        console.error("채팅방 목록 불러오기 실패:", err);
      }
    };
    fetchRoomList();
  }, []);

  // 주석: 2. 닉네임으로 사용자 검색
  const handleSearchUser = async () => {
    if (!searchNickname.trim()) return;

    try {
      const res = await fetch(`/api/messages/find-user?nickname=${encodeURIComponent(searchNickname.trim())}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "해당 닉네임을 찾을 수 없습니다.");
      }
      const userData = await res.json();
      const id = userData.mno;

      // 이미 존재하는 방인지 확인
      const exists = roomList.some((room) => Number(room.id) === Number(id));
      if (exists) {
        setSelectedId(id);
      } else {
        const msgs = await getDialog(id);
        const newRoom = {
          id,
          mno: id,
          name: userData.user_name,
          profile: userData.profileimg,
          preview: msgs.length > 0 ? msgs[msgs.length - 1].content : "",
          unread: 0,
          messages: msgs.map((m) => ({
            from: (m.senderId || m.sender?.mno) === user.mno ? "me" : "user",
            text: m.content,
            sentAt: m.sentAt,
          })),
        };
        setRoomList((prev) => [...prev, newRoom]);
        setSelectedId(id);
      }

      setSearchNickname("");
      setSearchModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. 채팅방 클릭 시 해당 방 대화내역 불러오기
  const handleRoomClick = async (room) => {
    setSelectedId(room.id);
    if (room.id === "bot") return;

    // 읽음 처리 요청
    await fetch(`/api/messages/mark-read?partnerId=${room.id}`, {
      method: "PUT",
      credentials: "include",
    });

    // 대화 불러오기
    const msgs = await getDialog(room.id);

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
              unread: 0,
            }
          : r
      )
    );
  };

  // 메세지 전송

  const handleSend = async () => {
    if (!input.trim() || !selectedRoom) return;
    if (selectedRoom.id === "bot") {
      // 주석:챗봇의 경우
      const updatedBot = {
        ...selectedRoom,
        messages: [...selectedRoom.messages, { from: "me", text: input }],
        preview: input,
      };
      setRoomList((rooms) => rooms.map((r) => (r.id === "bot" ? updatedBot : r)));
      setInput("");
      // 챗봇 응답
      try {
        const userPrompt = input.trim();

        console.log("프론트로부터 받은 prompt: " + userPrompt);
        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt }),
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
      // 주석: 유저의 경우
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

  // 주석: 대화 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRoom?.messages]);

  // 주석: 방 클릭/추가 시 대화내역 없으면 기본 안내
  const showMessages = selectedRoom?.messages?.length > 0;

  return (
    <div className={styles.messenger_panel}>
      <div className={styles.messenger_header}>
        <span>💬 KickTalk</span>
        <button className={styles.newchat_btn} onClick={() => setSearchModalOpen(true)}>
          + 새 채팅
        </button>
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
                  <span className={styles.message_text}>
                    {msg.text.startsWith("[킥옥션 자동발송]") ? (
                      <>
                        <span className={styles.pink}>[킥옥션 자동발송]</span>
                        {msg.text.replace("[킥옥션 자동발송]", "")}
                      </>
                    ) : (
                      msg.text
                    )}
                  </span>
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

      {/* 닉네임 검색 모달 */}
      {searchModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.search_modal}>
            <h3>닉네임으로 유저 검색</h3>
            <input type="text" placeholder="닉네임 입력.." value={searchNickname} onChange={(e) => setSearchNickname(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearchUser()} />
            <div className={styles.search_modal_btns}>
              <button onClick={handleSearchUser}>채팅 시작</button>
              <button onClick={() => setSearchModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
