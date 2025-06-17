import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/seller`;

export const postSellerRegister = async (mno, payload) => {
  const res = await axios.post(`${prefix}/register/${mno}`, payload);
  return res.data;
};


export const getSellerDetail = async (mno) => {
  const res = await axios.get(`${prefix}/detail/${mno}`);
  return res.data;
};

export const getSellerList = async (page = 1, size = 12) => {
  const res = await axios.get(`${prefix}/list`, {
    params: {page,size}
  });
  return res.data;
};