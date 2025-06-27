// src/pages/community/ModifyPage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, updateOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import "../../css/WritePage.css";

const ModifyPage = () => {
  const { pno } = useParams();
  const { moveToList, moveToRead } = useCustomMove();

  // 기본 상태: pimage는 기존 이미지 URL, file은 교체할 파일객체
  const [community, setCommunity] = useState({
    pno: 0,
    mno: 0,
    ptitle: "",
    pcontent: "",
    pregdate: "",
    view: 0,
    pimage: "",
  });
  const [file, setFile] = useState(null);

  // 기존 글 정보 로드
  useEffect(() => {
    getOne(pno)
      .then(data => {
        setCommunity({
          pno: data.pno,
          mno: data.mno,
          ptitle: data.ptitle,
          pcontent: data.pcontent,
          pregdate: data.pregdate,
          view: data.view,
          pimage: data.pimage || "",
        });
      })
      .catch(err => console.error("데이터 조회 실패:", err));
  }, [pno]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCommunity(prev => ({ ...prev, [name]: value }));
  };

  // 파일 선택 핸들러
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClickSave = () => {
    // FormData 생성
    const formData = new FormData();
    formData.append("ptitle", community.ptitle);
    formData.append("pcontent", community.pcontent);
    // 파일이 선택된 경우에만 append
    if (file) {
      formData.append("pimageFile", file);
    }

    updateOne(community.pno, formData)
      .then(() => moveToRead(community.pno))
      .catch(err => console.error("수정 실패:", err));
  };

  const isDisabled =
    !community.ptitle.trim() || !community.pcontent.trim();

  return (
    <div id="modify_Page">
      <div className="write_header">
        <h2>내 글 수정</h2>
        <button
          type="button"
          onClick={handleClickSave}
          disabled={isDisabled}
          style={isDisabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          저장
        </button>
      </div>

      <div className="write_content">
        <div>
          <label htmlFor="ptitle">제목</label>
          <input
            type="text"
            id="ptitle"
            name="ptitle"
            value={community.ptitle}
            onChange={handleChange}
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
          {/* 선택 전 기존 이미지 미리보기 */}
          {community.pimage && !file && (
            <img
              src={
                (process.env.REACT_APP_API_URL || "http://localhost:8080") +
                community.pimage
              }
              alt="기존 첨부"
              style={{ width: "200px", marginTop: "1rem" }}
            />
          )}
          {/* 파일 선택 시 미리보기 */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="새 첨부"
              style={{ width: "200px", marginTop: "1rem" }}
            />
          )}
        </div>
        <div>
          <label htmlFor="pcontent">내용</label>
          <textarea
            id="pcontent"
            name="pcontent"
            value={community.pcontent}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ModifyPage;
