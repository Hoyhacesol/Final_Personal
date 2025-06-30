// src/pages/community/ModifyPage.js
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getOne, updateOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/WritePage.css";

const ModifyPage = () => {
  const { pno } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // 중복 방지 (설정안하면 알럽 2번뜸)
  const didCheckAuth = useRef(false);
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

  // 기존 글 정보 로드 및 접근 권한 체크
  useEffect(() => {
    // 검사를 해서 한번만 실행되도록
    if (didCheckAuth.current) return;
    didCheckAuth.current = true;
    if (!user) {
      alert("글 수정을 위해 로그인해야 합니다.");
      navigate("/login", {
        state: { from: location.pathname + location.search },
        replace: true
      });
      return;
    }
    getOne(pno)
      .then(data => {
        if (user.mno !== data.mno) {
          alert("본인이 작성한 글만 수정 가능합니다.");
          moveToList();
          return;
        }
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
      .catch(err => {
        console.error("데이터 조회 실패:", err);
        alert("게시글을 불러오는 데 실패했습니다.");
        moveToList();
      });
  }, [pno, user, moveToList]);

  // 입력값 변경 핸들러
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

  // 저장 버튼 클릭
  const handleClickSave = () => {
    const formData = new FormData();
    formData.append("ptitle", community.ptitle);
    formData.append("pcontent", community.pcontent);
    if (file) {
      formData.append("pimageFile", file);
    }
    updateOne(community.pno, formData)
      .then(() => moveToRead(community.pno))
      .catch(err => {
        console.error("수정 실패:", err);
        alert("수정에 실패했습니다.");
      });
  };

  const isDisabled = !community.ptitle.trim() || !community.pcontent.trim();

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
