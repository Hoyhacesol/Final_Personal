// 견적 상세보기
const BContentP11 = ({ quote, companies }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
      {/* 견적 제목 및 요약 */}
      <div className="mb-4 border-b pb-4">
        <div className="text-sm text-gray-600">현재 견적</div>
        <div className="font-bold text-lg mt-1">{quote.title}</div>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
          <div>{quote.location}</div>
          <div>{quote.date} {quote.timeDesc}</div>
        </div>
        <div className="text-red-500 font-semibold mt-2">
          마감 임박! {quote.timeLeft} 남았어요!
        </div>
      </div>

      {/* 견적 제안 리스트 */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">견적 제안</div>
        <div className="grid grid-cols-2 gap-4">
          {companies.map((c, bno) => (
            <div key={bno} className="border rounded p-3">
              <div className="text-sm font-semibold">{c.name} | {c.location} | 리뷰 {c.reviewCount}건</div>
              <div className="text-sm mt-1 truncate">{c.description}</div>
              <div className="font-semibold mt-2">제시가 {c.price}원~</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between mt-6">
        <button className="border px-4 py-2 rounded hover:bg-gray-100">견적 요청 수정</button>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">선택된 업체 확정</button>
      </div>
    </div>
  );
};

export default BContentP11;


// bContentP11.js 파일 (내부 컴포넌트 이름은 BContentP11)
// 이 파일은 견적 상세 내용과 제안 업체 목록을 표시하는 컴포넌트입니다.

// key prop 사용:

// companies.map((c, idx) => (...)) 부분에서 key={idx}를 사용하고 있습니다. map 함수에서 index를 key로 사용하는 것은 항목의 순서가 변경되거나, 항목이 추가/삭제될 때 성능 문제나 예상치 못한 렌더링 버그를 유발할 수 있습니다.
// 권장 사항: 실제 백엔드에서 데이터를 불러올 때는 각 업체 제안 항목에 고유한 ID (예: c.id 또는 c.offerId 등)가 있을 것입니다. 해당 고유 ID를 key prop으로 사용하는 것이 좋습니다.
// 예시: companies.map((c) => (<div key={c.id || c.offerId}>...</div>)) (단, c 객체에 고유 ID 필드가 있어야 함)
// 버튼 기능 구현:

// "견적 요청 수정" 버튼과 "선택된 업체 확정" 버튼이 현재는 클릭 시 아무런 동작을 하지 않습니다.
// 개선점:
// "견적 요청 수정" 버튼: react-router-dom의 useNavigate 훅을 사용하여 OrderModifyPage (/request/modify/:ono)로 이동하는 기능을 추가해야 합니다.
// "선택된 업체 확정" 버튼: 클릭 시 선택된 업체에 대한 정보를 백엔드 API로 전송하는 axios 요청(PATCH 또는 PUT 메서드)을 구현해야 합니다.
// onClick 이벤트 핸들러를 추가하고, 필요한 로직을 구현해야 합니다.