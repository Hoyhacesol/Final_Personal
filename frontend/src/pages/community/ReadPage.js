import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne, deleteOne, getComments, postComment, updateComment, deleteComment } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/ReadPage.css";

const initState = {
  pno: 0,
  pcontent: "",
  pregdate: "",
  pimage: "",
  mno: 0,
  writerName: "",
  ptitle: "",
  view: 0,
  mprofileimg: "",
};

const ReadPage = () => {
  const { pno } = useParams();
  const [community, setCommunity] = useState(initState);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCno, setEditingCno] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const { moveToList, moveToModify } = useCustomMove();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 글 읽기 + 이전/다음 게시글 정보
  useEffect(() => {
    getOne(pno)
      .then((data) => {
        setCommunity({ ...data });
        // 백엔드가 내려준 prevPno/prevTitle, nextPno/nextTitle 사용
        setPrevPost(data.prevPno ? { pno: data.prevPno, title: data.prevTitle } : null);
        setNextPost(data.nextPno ? { pno: data.nextPno, title: data.nextTitle } : null);
      })
      .catch((err) => console.error(err));
  }, [pno]);

  // 댓글 로드
  useEffect(() => {
    getComments(pno)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("댓글 로드 실패:", {
          status: err.response?.status,
          body: err.response?.data,
          message: err.message,
        });
        setComments([]);
      });
  }, [pno]);

  // 댓글 작성
  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = () => {
    if (!user) {
      if (window.confirm("댓글을 작성하려면 로그인해야 합니다.\n로그인 페이지로 이동할까요?")) {
        return navigate("/login");
      }
      return;
    }
    if (!newComment.trim()) return;

    postComment(pno, newComment)
      .then((saved) => {
        setComments((prev) => [saved, ...prev]);
        setNewComment("");
      })
      .catch((err) => {
        console.error("댓글 작성 실패:", err);
        alert("댓글 작성에 실패했습니다.");
      });
  };

  // 댓글 삭제
  const onCommentDelete = (cno) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    deleteComment(pno, cno)
      .then(() => {
        setComments(comments.filter((c) => c.cno !== cno));
      })
      .catch(() => alert("삭제 실패"));
  };

  // 댓글 수정 시작
  const onEditStart = (c) => {
    setEditingCno(c.cno);
    setEditContent(c.content);
  };
  // 댓글 수정 취소
  const onEditCancel = () => {
    setEditingCno(null);
    setEditContent("");
  };
  // 댓글 수정 저장
  const onEditSave = (cno) => {
    if (!editContent.trim()) return;
    updateComment(pno, cno, editContent)
      .then((updated) => {
        setComments(comments.map((c) => (c.cno === cno ? updated : c)));
        onEditCancel();
      })
      .catch(() => alert("수정 실패"));
  };

  // 글 삭제 모달 핸들러
  const handleClickDelete = () => setShowConfirm(true);
  const confirmDelete = () => {
    deleteOne(pno)
      .then(() => {
        setShowConfirm(false);
        moveToList();
      })
      .catch((err) => console.error(err));
  };
  const cancelDelete = () => setShowConfirm(false);

  // 날짜 포맷
  function formatDisplayDate(isoString) {
    const d = new Date(isoString),
      today = new Date(),
      isToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    if (isToday)
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    const yyyy = d.getFullYear(),
      mm = String(d.getMonth() + 1).padStart(2, "0"),
      dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const isAuthor = user && user.mno === community.mno;

  return (
    <div id="read_Page">
      {showConfirm && (
        <>
          <div className="confirm-overlay" />
          <div className="confirm-modal">
            <p>정말 이 글을 삭제하시겠습니까?</p>
            <div className="confirm-buttons">
              <button type="button" className="btn" onClick={confirmDelete}>
                확인
              </button>
              <button type="button" className="btn" onClick={cancelDelete}>
                취소
              </button>
            </div>
          </div>
        </>
      )}

      <div className="btn_box">
        <button type="button" className="btn" onClick={moveToList}>
          ← 목록으로 돌아가기
        </button>
        {isAuthor && (
          <div className="action_buttons">
            <button type="button" className="btn" onClick={() => moveToModify(pno)}>
              수정
            </button>
            <button type="button" className="btn" onClick={handleClickDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="read_container">
        <div className="read_header">
          <h1 className="read_title">{community.ptitle}</h1>
          <div className="read_meta">
            <div className="read_info">
              <span>👤 {community.writerName || "(탈퇴한 사용자)"}</span>
              <span>📅 {formatDisplayDate(community.pregdate)}</span>
              <span>👁 {community.view}</span>
            </div>
          </div>
        </div>

        <div className="read_content">
          {community.pimage && (
            <div>
              <img src={`${process.env.REACT_APP_API_URL || "http://localhost:8080"}${community.pimage}`} alt="첨부 이미지" />
            </div>
          )}
          {community.pcontent}
        </div>
      </div>

      <div className="comments_section">
        <div className="comments_header">💬 댓글 {comments.length}개</div>
        <ul className="comment_list">
          {comments.map((c) => (
            <li key={c.cno} className="comment_item">
              <div className="comment_content">
                <span className="comment_profile">
                  <img src={`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/images/${c.mprofileimg || "baseprofile.png"}?t=${Date.now()}`} alt={`${c.writerName || "기본"} 프로필`} />
                </span>
                <span className="comment_author">{c.writerName || "(탈퇴한 사용자)"}</span>
                <span className="comment_date">{new Date(c.cregdate).toLocaleString()}</span>

                {/* 수정 중인 댓글이 아닐 때만 수정/삭제 버튼 노출 */}
                {user?.mno === c.mno && editingCno !== c.cno && (
                  <span className="comment_actions">
                    <button type="button" className="tiny_btn btn" onClick={() => onEditStart(c)}>
                      수정
                    </button>
                    <button type="button" className="tiny_btn btn" onClick={() => onCommentDelete(c.cno)}>
                      삭제
                    </button>
                  </span>
                )}
              </div>

              {editingCno === c.cno ? (
                <div className="edit_block">
                  <textarea className="comment_input" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="comment_actions">
                    {/* 저장/취소만 */}
                    <button type="button" className="tiny_btn btn" onClick={() => onEditSave(c.cno)}>
                      저장
                    </button>
                    <button type="button" className="tiny_btn btn" onClick={onEditCancel}>
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment_text">{c.content}</p>
              )}
            </li>
          ))}
        </ul>
        <div className="comment_form clearfix">
          <textarea className="comment_input" placeholder="댓글을 입력하세요..." value={newComment} onChange={handleCommentChange} />
          <button type="button" className="comment_submit" onClick={handleCommentSubmit}>
            댓글 작성
          </button>
        </div>
      </div>
      <div className="navigation">
        {community.prevTitle ? (
          <button type="button" className="nav_btn" onClick={() => navigate(`/community/read/${community.prevPno}`)}>
            ← 이전 글: {community.prevTitle}
          </button>
        ) : (
          <button type="button" className="nav_btn disabled" disabled>
            이전 글 없음
          </button>
        )}

        {community.nextTitle ? (
          <button type="button" className="nav_btn" onClick={() => navigate(`/community/read/${community.nextPno}`)}>
            다음 글: {community.nextTitle} →
          </button>
        ) : (
          <button type="buton" className="nav_btn disabled" disabled>
            다음 글 없음
          </button>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
