import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Socialgowhere() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";

    localStorage.removeItem("redirectAfterLogin");
    navigate(redirectPath, { replace: true });
  }, [navigate]);

  return null;
}

export default Socialgowhere;
