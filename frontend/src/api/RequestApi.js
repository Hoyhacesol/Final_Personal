import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}/api/orders`;

//견적 목록
export const getOrderList = async (page = 1, size = 5, city = null, district = null, playType = null) => {
  const params = { page, size };

  if (city && city !== "전국") {
    params.city = city;
    if (district) {
      params.district = district;
    }
  }

  if (playType && playType !== "종목") {
    params.playType = playType;
  }

  const res = await axios.get(`${prefix}/list`, { params });
  return res.data;
};

export const getOrderDetail = async (ono) => {
  const res = await axios.get(`${prefix}/${ono}`);
  return res.data;
};
