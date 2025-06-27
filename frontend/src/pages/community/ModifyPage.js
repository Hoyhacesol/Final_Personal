import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, updateOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import "../../css/WritePage.css";

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

    // 버튼 비활성화 상태
  const isDisabled = !community.ptitle.trim() || !community.pcontent.trim();

  return (
    <div id="modify_Page">
      <div className="write_header">
        <h2>내 글 수정</h2>
        <button
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
            // value={community.pimage}
            onChange={handleChange}
          />
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
