import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}`;

export const getImageUrl = (path) => {
  return `${prefix}/api/display?file=${path}`;
};

export const uploadImage = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file)); // name=files

  try {
    const res = await axios.post(`${prefix}/api/uploadAjax`, formData);

    // 백엔드 응답: { folderPath, uuid, fileName }
    // path만 만들어서 반환
    return res.data.map(item => {
      const filePath = `${item.folderPath}/${item.uuid}_${item.fileName}`;
      return {
        path: filePath,
        url: getImageUrl(filePath)
      };
    });

  } catch (err) {
    console.error("이미지 업로드 실패", err);
    throw err;
  }
};
