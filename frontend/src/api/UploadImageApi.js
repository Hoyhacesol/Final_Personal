import axios from "axios";
import { API_SERVER_HOST } from "./common";

const prefix = `${API_SERVER_HOST}`;

export const getImageUrl = (path) => {
  if (!path) return "";

  // 중복된 upload/ 제거
  const cleaned = path.startsWith("upload/") ? path.slice(7) : path;
  return `${prefix}/api/display?file=${encodeURIComponent(cleaned)}`;
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

export const removeImage = async (filePath) => {
  try {
    const res = await axios.post(`${prefix}/api/removeFile`, null, {
      params: { fileName: filePath }
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const removeImageOnExit = (filePath) => {
  try {
    // sendBeacon은 POST만 가능. body는 빈 blob
    const blob = new Blob([], { type: "text/plain" });
    navigator.sendBeacon(`${prefix}/api/removeFile?fileName=${encodeURIComponent(filePath)}`, blob);
  } catch (err) {
    console.error("sendBeacon 삭제 실패", err);
  }
};
