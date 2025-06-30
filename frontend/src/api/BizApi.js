import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/biz`;

//입찰 등록
export const registerBiz = async (bizData) => {
  const res = await axios.post(`${prefix}/register`, bizData);
  return res.data;
};

//입찰 등록시 견적 정보가져오는 함수
export const checkBizRegistered = async (ono) => {
  const res = await axios.get(`${prefix}/check/${ono}`);
  return res.data.registered; // true/false
};

