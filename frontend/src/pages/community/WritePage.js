import { useState, useEffect, useRef } from "react";
import { postWrite } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/WritePage.css";

const initState = {
  ptitle: "",
  pcontent: "",
  pimage: null  // 파일객체 저장용
};

const WritePage = () => {
  const [community, setCommunity] = useState({ ...initState });
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (window.confirm("글 작성을 위해 로그인해야 합니다. 로그인 페이지로 이동할까요?")) {
        navigate("/login", { state: { from: "/community/write" } });
      } else {
        moveToList();
      }
    }
  }, [user, navigate, moveToList]);

  const handleChangeCommunity = (e) => {
    const { name, value } = e.target;
    setCommunity(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCommunity(prev => ({ ...prev, pimage: e.target.files[0] }));
  };

  const handleClickWrite = () => {
    if (!user) return;

    // 검증: 제목/내용이 비어 있으면 등록 차단
    if (!community.ptitle.trim() || !community.pcontent.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("ptitle", community.ptitle);
    formData.append("pcontent", community.pcontent);
    formData.append("mno", user.mno);
    if (community.pimage) {
      formData.append("pimageFile", community.pimage);
    }

    postWrite(formData)
      .then(() => moveToList())
      .catch(err => console.error("글쓰기 실패:", err));
  };

  // 버튼 비활성화 상태
  const isDisabled = !community.ptitle.trim() || !community.pcontent.trim();

  return (
    <div id="write_page">
      <div className="write_header">
        <h2>새 글 작성</h2>
        <button
          type="button"
          onClick={handleClickWrite}
          disabled={isDisabled}
          style={isDisabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          등록
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
          {community.pimage && (
            <img
              src={URL.createObjectURL(community.pimage)}
              alt="이미지 미리보기"
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
            onChange={handleChangeCommunity}
          />
        </div>
      </div>
    </div>
  );
};

export default WritePage;
