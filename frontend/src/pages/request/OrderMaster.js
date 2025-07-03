import { Outlet } from "react-router-dom"

import { useEffect } from "react";
import { useAuth } from "../../contexts/Authcontext";

import "../../components/requestComponents/requestDebugStyle.css";


const OrderMaster = () => {
    const { user } = useAuth();

    useEffect(() => {
        console.log("[req 디버그] 현재 로그인된 사용자:", user);
    }, [user]);
    return (
        <div className="request-component">
            <div id="min-h-screen pt-12   orderMaster">
                <div><Outlet /></div>
            </div>
        </div>
    );
}
export default OrderMaster;