import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, deleteOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "./ResultModal";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/ReadPage.css";

const initState = {
    pno: 0,
    pcontent: "",
    pregdate: "",  // TIMESTAMP
    pimage: "",    // 이미지 URL
    mno: 0,        // 작성자 회원번호
    writerName: "", // 작성자 닉네임
    ptitle: "",
    view: 0        // 조회수
};

const ReadPage = () => {
    const { pno } = useParams();
    const [community, setCommunity] = useState(initState);
    const { moveToList, moveToModify } = useCustomMove();
    const [result, setResult] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        getOne(pno)
            .then((data) => setCommunity({ ...data }))
            .catch(err => console.error(err));
    }, [pno]);

    const handleClickDelete = () => {
        deleteOne(pno)
            .then(() => setResult('Deleted'))
            .catch(err => console.error(err));
    };

    const closeModal = () => moveToList();

    function formatDisplayDate(isoString) {
        const d = new Date(isoString);
        const today = new Date();
        const isToday =
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();
        if (isToday) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }

    const isAuthor = user && user.mno === community.mno;

    return (
        <div id="read_Page">
            {result && (
                <ResultModal
                    title="처리결과"
                    content={result}
                    callbackFn={closeModal}
                />
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
                            <span>👤 {community.writerName || community.mno}</span>
                            <span>📅 {formatDisplayDate(community.pregdate)}</span>
                            <span>👁 {community.view}</span>
                        </div>
                    </div>
                </div>

                <div className="read_content">
                    {community.pcontent}
                    {community.pimage && (
                        <div>
                            <img
                                src={`${process.env.REACT_APP_API_URL || "http://localhost:8080"}${community.pimage}`}
                                alt="첨부 이미지"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="comments_section">
                <div className="comments_header">💬 댓글 8개</div>
                <div className="comment_form clearfix">
                    <textarea className="comment_input" placeholder="댓글을 입력하세요..." />
                    <button className="comment_submit" onClick={() => {}}>댓글 작성</button>
                </div>
            </div>

            <div className="navigation">
                <button className="nav_btn">← 이전 글: 골키퍼 장갑 관리 꿀팁</button>
                <button className="nav_btn">다음 글: 축구공 대여 역경매 →</button>
            </div>
        </div>
    );
};

export default ReadPage;
