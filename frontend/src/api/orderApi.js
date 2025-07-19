// src/api/orderApi.js

import axios from "axios";
import { API_SERVER_HOST } from "./common"; // 공통 API 호스트

const prefix = `${API_SERVER_HOST}/api/orders`;

// 견적 등록 (POST)
export const createOrder = async (orderData) => {
  const res = await axios.post(`${prefix}`, orderData);
  return res.data;
};

// 견적 상세 조회
export const getOrderDetail = async (ono) => {
  const res = await axios.get(`${prefix}/${ono}`);
  return res.data;
};

// 견적 수정
export const updateOrder = async (ono, orderData) => {
  const res = await axios.patch(`${prefix}/${ono}`, orderData);
  return res.data;
};

// 마이페이지 - 견적 목록 조회 (status: active, closed, cancelled)
export const fetchMyOrders = async ({ status, page = 1, size = 3 }) => {
  const res = await axios.get(`${prefix}/my-orders/paginated`, {
    params: { status, page, size },
    withCredentials: true,
  });
  return res.data;
};

// 견적 마감 처리
export const finishOrder = async (ono) => {
  const res = await axios.patch(`${prefix}/finish/${ono}`, {}, { withCredentials: true });
  return res.data;
};

export const fetchOrderDetail = async (ono) => {
  const res = await axios.get(`${prefix}/${ono}`, { withCredentials: true });
  return res.data;
};

export const confirmCompanySelection = (ono, companyId) => {
  return axios.patch(`/api/orders/${ono}/select`, { companyId });
};

export const deleteOrder = (ono) => {
  return axios.patch(`/api/orders/delete/${ono}`, { ono });
};
