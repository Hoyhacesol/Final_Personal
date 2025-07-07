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
    // 401->return
    if (err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};
