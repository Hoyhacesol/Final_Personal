import axios from "axios"
import { API_SERVER_HOST } from "./common";

//서버 주소
const prefix = `${API_SERVER_HOST}/api/community`

export const getOne = async (pno) => {
    return axios
    .get(`${prefix}/${pno}`)
    .then(res => res.data);
};

export const getList = async (pageParam) => {
    const { page, size, type, keyword } = pageParam;

  // 기본 파라미터
  const params = { page, size };

  // type, keyword가 있으면 params에 추가
  if (type)    params.type = type;
  if (keyword) params.keyword = keyword;

  const res = await axios.get(`${prefix}/list`, { params });
  return res.data;
}

export const postWrite = async (communityObj) => {
    // FormData로 전송할 때는 headers에 multipart 설정
    const res = await axios.post(
        prefix,
        communityObj,
        { headers: { "Content-Type": "multipart/form-data" } }
    )
    return res.data
}

export const deleteOne = async (pno) => {
    const res = await axios.delete(`${prefix}/${pno}`)
    return res.data
}

export const updateOne = async (pno, communityDTO) => {
    const res = await axios.put(`${prefix}/${pno}`, communityDTO)
    return res.data
};