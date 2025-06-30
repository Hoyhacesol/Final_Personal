import React, { useState } from "react";
import styles from "./ChatBotRoom.module.css";
import axios from "axios";

function ChatBotRoom({ history, setHistory }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newHistory = [...history, { from: "me", text: input }];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chatbot", { prompt: input });
      setHistory([...newHistory, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setHistory([...newHistory, { from: "bot", text: "오류가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chat_bot_room}>
      <div className={styles.chat_history}>
        {history.map((msg, i) => (
          <div key={i} className={msg.from === "me" ? styles.chat_bubble_me : styles.chat_bubble_bot}>
            {msg.from === "bot" && <div className={styles.speaker_name}>킥옥션 봇</div>}
            {msg.text}
          </div>
        ))}
        {loading && <div className={styles.chat_bubble_you}>...</div>}
      </div>
      <div className={styles.chat_input_row}>
        <input className={styles.chat_input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="챗봇에게 질문해보세요" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
        <button className={styles.send_btn} onClick={handleSend} disabled={loading}>
          전송
        </button>
      </div>
    </div>
  );
}
export default ChatBotRoom;
