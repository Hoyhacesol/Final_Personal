// src/pages/help/HelpPage.js
import { useEffect, useState } from "react";
import PageComponent from "../community/PageComponent";
import { useSearchParams } from "react-router-dom";
import "../../css/HelpPage.css";

// TODO: 여기에 직접 데이터 채워넣으세요.
export const faqData = [
  { faqId: 1, question: "이 플랫폼은 어떤 서비스인가요?", answer: "\u2937 풋살·축구 등 스포츠 장비 대여를 역경매 방식으로 연결해주는 플랫폼입니다." },
  { faqId: 2, question: "장비 제공자(업체)와 대여자(고객)는 어떻게 거래하나요?", answer: "\u2937 대여자가 견적 요청서를 등록하면, 장비 제공자(업체)가 입찰로 견적을 제시하고, 대여자가 최적의 금액과 조건을 선택해 거래를 진행합니다." },
  { faqId: 3, question: "요청서는 무엇이며, 어떻게 작성하나요?", answer: "\u2937 요청서는 대여 희망 장비, 대여 기간, 장소 등의 정보를 입력하는 양식입니다. '견적 요청하기' 메뉴에서 간단히 작성할 수 있습니다." },
  { faqId: 4, question: "장비 연결 시 수수료가 있나요?", answer: "\u2937 플랫폼 이용 수수료는 대여료의 10%이며, 결제 시 자동으로 부과됩니다." },
  { faqId: 5, question: "장비 제공자로 가입하려면 자격조건이 있나요?", answer: "\u2937 장비 제공자로 가입하려면 본인 인증 후 유효한 장비 보유를 증빙할 수 있는 사진을 제출해야 합니다." },
  { faqId: 6, question: "플랫폼 캐시는 무엇인가요?", answer: "\u2937 캐시는 플랫폼 내에서 사용하는 선불 결제 수단으로, 충전 후 대여료 및 수수료 결제에 활용할 수 있습니다." },
  { faqId: 7, question: "견적은 어떻게 보내나요?", answer: "\u2937 요청서 등록 후 여러 제공자가 제시한 입찰 중 원하는 금액과 조건을 선택하면 자동으로 견적이 확정됩니다." },
  { faqId: 8, question: "아이디(이메일), 비밀번호를 잊어버렸어요.", answer: "\u2937 로그인 페이지의 '아이디/비밀번호 찾기' 기능을 통해 등록된 이메일로 재설정 링크를 받으실 수 있습니다." },
  { faqId: 9, question: "제공자에게 리뷰는 어떻게 남기나요?", answer: "\u2937 거래 완료 후 '내 대여 내역'에서 해당 거래를 선택하고 리뷰 작성 버튼을 눌러 평가를 남길 수 있습니다." },
  { faqId: 10, question: "대여 기간 연장은 어떻게 하나요?", answer: "\u2937 ‘내 대여 내역’에서 연장 요청을 보내면 제공자가 승인 후 연장 기간만큼 추가 결제가 진행됩니다." },
  { faqId: 11, question: "결제 수단은 어떤 것이 있나요?", answer: "\u2937 신용카드, 휴대폰 결제, 카카오페이 등 다양한 방법으로 결제하실 수 있습니다." },
  { faqId: 12, question: "예약 취소 및 환불 정책은 어떻게 되나요?", answer: "\u2937 대여 시작 전까지 취소 가능하며, 취소 시 대여료의 10%가 수수료로 차감됩니다. 세부사항은 이용약관을 참고하세요." },
  { faqId: 13, question: "장비 파손 시에는 어떻게 처리되나요?", answer: "\u2937 파손된 장비는 손상 비용을 확인하여 보증금에서 차감하거나 별도 청구가 이루어질 수 있습니다." },
  { faqId: 14, question: "고객센터에 문의하려면 어떻게 하나요?", answer: "\u2937 고객센터 페이지의 '1:1 문의'를 통해 남겨주시면 24시간 이내에 답변 드립니다." }
];
const HelpPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sizeParam = parseInt(searchParams.get("size") || "10", 10);

  const [page, setPage] = useState(pageParam);
  const [size] = useState(sizeParam);
  const [searchType, setSearchType] = useState("qa"); // q:질문, a:답변, qa:전체
  const [keyword, setKeyword] = useState("");

  // 화면에 뿌릴 현재 페이지 데이터 및 페이징 정보
  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    current: 0,
    totalPage: 0,
  });

  // 열린(펼친) FAQ 항목 ID 집합
  const [expandedIds, setExpandedIds] = useState(new Set());

  // 검색·페이징 로직
  useEffect(() => {
    // 1) URL 쿼리스트링 동기화
    setSearchParams({ page, size });

    // 2) 필터링
    const kw = keyword.trim().toLowerCase();
    let filtered = faqData.filter((item) => {
      if (!kw) return true;
      const q = item.question.toLowerCase();
      const a = item.answer.toLowerCase();
      if (searchType === "q")  return q.includes(kw);
      if (searchType === "a")  return a.includes(kw);
      /* qa */                return q.includes(kw) || a.includes(kw);
    });

    // 3) 페이징 계산
    const totalPage = Math.max(1, Math.ceil(filtered.length / size));
    const current = Math.min(page, totalPage);
    const start = (current - 1) * size;
    const dtoList = filtered.slice(start, start + size);

    // 4) 페이지 번호 리스트 (1,2…totalPage)
    const pageNumList = Array.from({ length: totalPage }, (_, i) => i + 1);

    setServerData({
      dtoList,
      pageNumList,
      prev: current > 1,
      next: current < totalPage,
      prevPage: current - 1,
      nextPage: current + 1,
      current,
      totalPage,
    });

    // 스크롤을 맨 위로
    window.scrollTo(0, 0);
  }, [page, size, searchType, keyword, setSearchParams]);

  const handleSearch = () => {
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div id="help_page">
      <div className="faq_header">
        <div className="faq_title">자주 묻는 질문(FAQ)</div>
        <div className="search_box">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="qa">전체</option>
            <option value="q">질문</option>
            <option value="a">답변</option>
          </select>
          <input
            className="search_input"
            type="text"
            placeholder="검색어를 입력하세요..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button type="button" className="btn" onClick={handleSearch}>🔍 검색</button>
        </div>
      </div>

      <div className="faq_list">
        {serverData.dtoList.map((item) => (
          <div key={item.faqId} className="faq_item">
            <div
              className="faq_question"
              onClick={() => toggleExpand(item.faqId)}
            >
              <span>{item.question}</span>
              <span className="arrow">
                {expandedIds.has(item.faqId) ? "▲" : "▼"}
              </span>
            </div>
            {expandedIds.has(item.faqId) && (
              <div className="faq_answer">{item.answer}</div>
            )}
          </div>
        ))}

        {serverData.dtoList.length === 0 && (
          <div className="no_data">등록된 FAQ가 없습니다.</div>
        )}
      </div>

      <PageComponent
        serverData={serverData}
        onPageChange={(num) => setPage(num)}
      />
    </div>
  );
};

export default HelpPage;
