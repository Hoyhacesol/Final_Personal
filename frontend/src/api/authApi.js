import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/auth`;

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${prefix}/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    // 401이면 null 리턴
    if (err.response?.status === 401) {
      return null;
    }
    // 그 외 오류는 콘솔에 출력 (디버깅용)
    console.error("checkAuth error:", err);
    throw err;
  }
};
