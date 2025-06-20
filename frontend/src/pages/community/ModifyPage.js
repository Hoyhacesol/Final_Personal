import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, updateOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import "../../css/ModifyPage.css";

const ModifyPage = () => {
  const { pno } = useParams();
  const [community, setCommunity] = useState({
    pno: 0,
    mno: 0,
    ptitle: "",
    pcontent: "",
    pregdate: "",
    view: 0,
    pimage: ""
  });
  const { moveToList, moveToRead } = useCustomMove();

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
          pimage: data.pimage || ""
        });
      })
      .catch(err => console.error("데이터 조회 실패:", err));
  }, [pno]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCommunity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickSave = () => {
    updateOne(community.pno, community)
      .then(() => moveToRead(community.pno))
      .catch(err => console.error("수정 실패:", err));
  };

  return (
    <div id="modify_Page">
      <h2>글 수정</h2>

      <div>
        <label>글 번호</label>
        <span>{community.pno}</span>
      </div>

      <div>
        <label>제목</label>
        <input
          type="text"
          name="ptitle"
          value={community.ptitle}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>작성자</label>
        <input
          type="text"
          name="mno"
          value={community.mno}
          readOnly
        />
      </div>

      <div>
        <label>내용</label>
        <textarea
          name="pcontent"
          value={community.pcontent}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>이미지 URL</label>
        <input
          type="text"
          name="pimage"
          value={community.pimage}
          onChange={handleChange}
          placeholder="http://…"
        />
      </div>

      <div>
        <label>작성일</label>
        <span>{community.pregdate}</span>
      </div>

      <div>
        <label>조회수</label>
        <span>{community.view}</span>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button className="btn" type="button" onClick={moveToList}>
          목록
        </button>
        <button className="btn" type="button" onClick={handleClickSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default ModifyPage;
