import { Link, Outlet, useNavigate } from "react-router-dom";

// import { useCallback } from "react";
import { useEffect } from "react";
import { useAuth } from "../../contexts/Authcontext";

import "../../components/requestComponents/requestDebugStyle.css";


const OrderMaster = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        console.log("[req 디버그] 현재 로그인된 사용자:", user);
        if(user===null){
            alert("로그아웃이 감지되었습니다. 다시 로그인해주세요.");
            navigate(`/`);
        }
    }, [user]);

    return (
        <div className="request-component">
            <div id="min-h-screen pt-12   orderMaster">
            <Link to="/request/write">견적 C</Link> &nbsp;
            <Link to="/request/list">견적 My</Link> &nbsp;
                <div><Outlet /></div>
            </div>
        </div>
    );
}
export default OrderMaster;