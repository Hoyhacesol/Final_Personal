import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/seller`;


//등록 
export const postSellerRegister = async (payload) => {
  const res = await axios.post(`${prefix}/register`, payload);
  return res.data;
};

//상세보기
export const getSellerDetail = async (mno) => {
  const res = await axios.get(`${prefix}/detail`, {params: { mno }});
  return res.data;
};

//목록
export const getSellerList = async (page = 1, size = 12) => {
  const res = await axios.get(`${prefix}/list`, {
    params: {page,size}
  });
  return res.data;
};

//이미 등록했는지 확인하는 함수 
export const getSellerRegistered = async () => {
  const res = await axios.get(`${prefix}/registered`);
  return res.data;
};

//등록들어갈때 정보가져오는 함수
export const getSellerRegisterInfo = async () => {
  const res = await axios.get(`${prefix}/register-info`);
  return res.data;
};

//수정들어갈때 정보가져오는 함수
export const getSellerModifyInfo = async () => {
  const res = await axios.get(`${prefix}/modify-info`);
  return res.data;
};

//수정
export const putSellerUpdate = async (payload) => {
  const res = await axios.put(`${prefix}/modify`, payload);
  return res.data;
};
