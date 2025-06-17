import { useState } from "react";
import { postWrite } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import styles from "./WriteComponent.module.css";

const initState = {
  ptitle: "",
  pcontent: "",
  mno: "",      // 로그인한 회원 ID
  pimage: null  // 파일객체 저장용
};

const WriteComponent = () => {
  const [community, setCommunity] = useState({ ...initState });
  const { moveToList } = useCustomMove();

  const handleChangeCommunity = (e) => {
    const { name, value } = e.target;
    setCommunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCommunity((prev) => ({ ...prev, pimage: e.target.files[0] }));
  };

  const handleClickWrite = () => {
    const formData = new FormData();
    formData.append("ptitle", community.ptitle);
    formData.append("pcontent", community.pcontent);
    formData.append("mno", community.mno);
    if (community.pimage) {
      formData.append("pimageFile", community.pimage);
    }

    postWrite(formData)
      .then(() => {
        moveToList();
      })
      .catch((err) => {
        console.error("글쓰기 실패:", err);
      });
  };

  return (
    <div id={styles.writeComponent}>
      <div className={styles.write_header}>
        <h2>새 글 작성</h2>
        <button onClick={handleClickWrite}>등록</button>
      </div>
      <div className={styles.write_content}>
        <div>
          <label htmlFor="ptitle">제목</label>
          <input
            type="text"
            id="ptitle"
            name="ptitle"
            value={community.ptitle}
            onChange={handleChangeCommunity}
          />
        </div>
        <div>
          <label htmlFor="pimageFile">이미지 업로드</label>
          <input
            id="pimageFile"
            type="file"
            name="pimageFile"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="pcontent">내용</label>
          <textarea
            id="pcontent"
            name="pcontent"
            value={community.pcontent}
            onChange={handleChangeCommunity}
          />
        </div>
        <div>
          <label htmlFor="mno">회원 ID</label>
          <input
            id="mno"
            type="text"
            name="mno"
            value={community.mno}
            onChange={handleChangeCommunity}
          />
        </div>
      </div>
    </div>
  );
};

export default WriteComponent;
