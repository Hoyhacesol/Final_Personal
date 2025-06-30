import React from "react";
import styles from "./MessengerPanel.module.css";

function Chatting({ onClick }) {
  return (
    <button className={styles.chatting_icon} onClick={onClick}>
      <svg width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#27b6f7" />
        <rect x="6" y="8" width="12" height="8" rx="2" fill="#fff" />
        <circle cx="9" cy="12" r="1" fill="#27b6f7" />
        <circle cx="12" cy="12" r="1" fill="#27b6f7" />
        <circle cx="15" cy="12" r="1" fill="#27b6f7" />
      </svg>
    </button>
  );
}

export default Chatting;
