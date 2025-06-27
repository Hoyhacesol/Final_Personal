import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Socialgowhere() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[Socialgowhere] 컴포넌트 마운트됨");
    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
    console.log("[Socialgowhere] redirectPath:", redirectPath);
    localStorage.removeItem("redirectAfterLogin");
    navigate(redirectPath, { replace: true });
  }, [navigate]);

  return null;
}

export default Socialgowhere;
