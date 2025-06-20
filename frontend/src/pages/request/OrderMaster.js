import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const OrderMaster = () => {
    const navigate = useNavigate()
    const handleClickList = useCallback(() => { navigate({ pathname: 'list' }) },[])
    const handleClickWrite = useCallback(() => { navigate({ pathname: 'write' }) },[])
    return (
        <div id="orderMaster">
          <Link to="/request/write">견적 C</Link> &nbsp;
          {/* <Link to="/request/read/ono">견적 R</Link> &nbsp;
          <Link to="/request/modify/ono">견적 U</Link> &nbsp; */}
          <Link to="/request/list">견적 My</Link> &nbsp;
          <Link to={`/request/modify/16`}>Test-견적 수정</Link> &nbsp;
          <Link to={`/request/read/16`}>Test-견적 상세보기</Link>

            <div onClick={handleClickList}></div>
            <div onClick={handleClickWrite}></div>
            <div><Outlet /></div>
        </div>
    );
}
export default OrderMaster;