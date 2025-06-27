// src/pages/community/ListPage.js
import { useEffect, useState, useCallback } from "react";
import { getList } from "../../api/communityApi";
import PageComponent from "./PageComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/ListPage.css";

// 날짜 포맷 함수, 변경 없음
function formatDisplayDate(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
}

const ListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sizeParam = parseInt(searchParams.get("size") || "10", 10);

  const [page, setPage] = useState(pageParam);
  const [size] = useState(sizeParam);
  const [searchType, setSearchType] = useState("t");

  // 입력 중인 키워드와 실제 검색 키워드 분리
  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    current: 0,
    totalPage: 0,
  });

  // 서버 데이터 로드: keyword가 변경될 때만 실행
  useEffect(() => {
    getList({ page, size, type: searchType, keyword })
      .then((data) => {
        setServerData({
          dtoList: data.dtoList || [],
          pageNumList: data.pageNumList || [],
          pageRequestDTO: data.pageRequestDTO,
          prev: data.prev,
          next: data.next,
          prevPage: data.prevPage,
          nextPage: data.nextPage,
          current: data.current,
          totalPage: data.totalPage,
        });
      })
      .catch((err) => {
        console.error("리스트 로드 실패:", err);
        setServerData(prev => ({ ...prev, dtoList: [], pageNumList: [] }));
      });

    // URL 동기화 및 스크롤 (page와 size만)
    setSearchParams({ page, size });
    window.scrollTo(0, 0);
  }, [page, size, searchType, keyword, setSearchParams]);

  // 검색 실행: Enter 또는 버튼 클릭으로만 호출
  const handleSearch = useCallback(() => {
    setPage(1);
    setKeyword(inputKeyword.trim());
  }, [inputKeyword]);

  // 검색 타입 변경: 입력창이 비어있으면 기존 키워드도 초기화
  const handleTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setSearchType(newType);
    if (!inputKeyword.trim()) {
      setKeyword("");
      setPage(1);
      setSearchParams({ page: 1, size });
    }
  }, [inputKeyword, size, setSearchParams]);

  // 페이지 변경 시 URL 동기화
  const onPageChange = useCallback((num) => {
    setPage(num);
  }, []);

  // 글쓰기 핸들러
  const handleClickWrite = useCallback(() => {
    if (user) {
      navigate("/community/write");
    } else if (window.confirm("글 작성을 위해 로그인해야 합니다. 로그인 페이지로 이동할까요?")) {
      navigate("/login", { state: { from: "/community/write" } });
    }
  }, [user, navigate]);

  return (
    <div id="list_page">
      <div className="list_header">
        <div className="list_title">자유게시판</div>
        <div className="search_box">
          <select value={searchType} onChange={handleTypeChange}>
            <option value="t">제목</option>
            <option value="c">내용</option>
            <option value="tc">제목+내용</option>
          </select>
          <input
            className="search_input"
            type="text"
            placeholder="게시글 검색..."
            value={inputKeyword}
            onChange={e => setInputKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button type="button" className="btn" onClick={handleSearch}>🔍 검색</button>
        </div>
        <div className="btn write_btn" onClick={handleClickWrite}>✏️ 글쓰기</div>
      </div>

      <div className="board_table">
        <div className="table_header">
          <div>번호</div>
          <div>제목</div>
          <div className="hide_mobile">작성자</div>
          <div className="hide_mobile">작성일</div>
          <div>조회수</div>
        </div>
        {serverData.dtoList.length > 0 ? (
          serverData.dtoList.map(item => (
            <div
              key={item.pno}
              className="table_row"
              onClick={() => navigate(`/community/read/${item.pno}?page=${page}&size=${size}`)}
            >
              <div className="post_number">{item.pno}</div>
              <div className="post_title">{item.ptitle}</div>
              <div className="post_meta hide_mobile">{item.writerName || item.mno}</div>
              <div className="post_meta hide_mobile">{formatDisplayDate(item.pregdate)}</div>
              <div className="post_meta">{item.view}</div>
            </div>
          ))
        ) : (
          <div className="no_data">등록된 게시글이 없습니다.</div>
        )}
      </div>

      <PageComponent serverData={serverData} onPageChange={onPageChange} />
    </div>
  );
};

export default ListPage;
