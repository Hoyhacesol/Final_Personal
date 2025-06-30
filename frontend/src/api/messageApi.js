import axios from "axios";

// 1:1 대화 내역 조회
export const getDialog = async (targetMno) => {
  const res = await axios.get(`/api/messages/dialog?target=${targetMno}`);
  return res.data;
};

// 메시지 전송
export const sendMessage = async (receiverId, content) => {
  const res = await axios.post(`/api/messages`, null, {
    params: { receiverId, content },
  });
  return res.data;
};

// 받은 쪽지함
export const getInbox = async () => {
  const res = await axios.get(`/api/messages/inbox`);
  return res.data;
};

// 보낸 쪽지함
export const getOutbox = async () => {
  const res = await axios.get(`/api/messages/outbox`);
  return res.data;
};

// 메시지 삭제
export const deleteMessage = async (msgId, type) => {
  const res = await axios.delete(`/api/messages/${msgId}?type=${type}`);
  return res.data;
};
