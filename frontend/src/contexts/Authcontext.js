import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱이 처음 실행될 때(새로고침 포함) 로그인된 유저 정보를 받아옴
  useEffect(() => {
    checkAuth()
      .then((user) => setUser(user)) // user가 null이면 비로그인 상태로 유지
      .catch(() => setUser(null)) //   로그인 안 되어 있으면 null로 초기화
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
