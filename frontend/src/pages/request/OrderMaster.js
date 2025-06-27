import { Link, Outlet } from "react-router-dom";
// import { useCallback } from "react";

import "../../components/requestComponents/requestDebugStyle.css";


const OrderMaster = () => {
    // const navigate = useNavigate()
    // const handleClickList = useCallback(() => { navigate({ pathname: 'list' }) },[])
    // const handleClickWrite = useCallback(() => { navigate({ pathname: 'write' }) },[])
    return (
        <div className="request-component">
            <div id="min-h-screen pt-12   orderMaster">
            <Link to="/request/write">견적 C</Link> &nbsp;
            <Link to="/request/list">견적 My</Link> &nbsp;
            <Link to={`/request/modify/17`}>Test-견적 수정</Link> &nbsp;
            <Link to={`/request/read/17`}>Test-견적 상세보기</Link>
                <div><Outlet /></div>
            </div>
        </div>
    );
}
export default OrderMaster;