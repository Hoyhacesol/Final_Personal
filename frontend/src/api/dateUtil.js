export const formatTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
