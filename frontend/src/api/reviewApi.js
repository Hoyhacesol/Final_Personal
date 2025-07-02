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

export const getReviewsBySeller = async (mno) => {
  const res = await axios.get(`${prefix}/${mno}`);
  return res.data;
};