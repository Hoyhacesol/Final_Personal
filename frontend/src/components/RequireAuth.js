import { useAuth } from "../contexts/Authcontext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 현재 경로를 기억하고 로그인으로 이동
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default RequireAuth;
