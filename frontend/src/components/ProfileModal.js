import React from "react";
import styles from "./ProfileModal.module.css";

export default function ProfileModal({ user, onClose, onSendMessage }) {
  if (!user) return null;
  return (
    <div className={styles.profile_modal}>
      <button className={styles.profile_modal_btn} onClick={() => onSendMessage(user)}>
        메시지 보내기
      </button>
      <button className={styles.profile_modal_btn_cancel} onClick={onClose}>
        취소
      </button>
    </div>
  );
}
