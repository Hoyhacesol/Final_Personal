import { useNavigate, useLocation } from "react-router-dom";
import "../css/ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 기본 메시지
  const errorCode = location.state?.code || "오류";
  const errorMsg = location.state?.message || "잘못된 접근입니다.";

  return (
    <div className="error-page-container">
      <div className="error-code">[{errorCode}]</div>
      <h1>⚠️ {errorMsg}</h1>
      <p>요청이 유효하지 않거나 권한이 없습니다.</p>
      <button onClick={() => navigate("/")}>🏠 메인 페이지로 이동</button>
    </div>
  );
};

export default ErrorPage;
