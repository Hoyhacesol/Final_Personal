import axios from "axios";
import { API_SERVER_HOST } from "./common";

//서버 주소
const prefix = `${API_SERVER_HOST}/api/reviews`


export const postReview = ({ ono, mno, rating, comment }) => {
  return axios.post(`${prefix}`, {
    ono,
    mno,
    rating,
    rcontent: comment
  }, { withCredentials: true });
};

export const getReviewsBySeller = async (mno, page = 0, size = 5) => {
  const res = await axios.get(`${prefix}/seller/${mno}`, {
    params: { page, size },
    withCredentials: true
  });
  return res.data; 
};


// Request >>>>>>>>>>>>>>>>>>>>>>>>>
export const getReview = async (ono) => {
  const response = await axios.get(`/api/reviews/${ono}`);
  return response.data;
};
export const updateReview = async ({ ono, rating, rcontent }) => {
  const response = await axios.put(`/api/reviews/${ono}`, { rating, rcontent });
  return response.data;
};