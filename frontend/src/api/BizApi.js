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

// 입찰 삭제
export const deleteBiz = async (ono) => {
  const res = await axios.delete(`${prefix}/delete/${ono}`);
  return res.data;
};

// 입찰 상세 조회 (수정 시 기존 데이터 가져오기)
export const getBizDetail = async (ono) => {
  const res = await axios.get(`${prefix}/${ono}`);
  return res.data; // DTO 전체 반환
};

// 입찰 수정
export const updateBiz = async (bizData) => {
  const res = await axios.patch(`${prefix}/modify`, bizData);
  return res.data;
};

//입찰 조건
export const checkBizModifiable = async (ono) => {
  return axios.get(`/api/biz/check-editable/${ono}`); 
};

// 입찰 삭제 이력 확인
export const checkDeletedBid = async (ono) => {
  const res = await axios.get(`${prefix}/check-deleted/${ono}`);
  return res.data.deleted;
};

