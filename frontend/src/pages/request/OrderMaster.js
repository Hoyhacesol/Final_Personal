import { Outlet } from "react-router-dom"

import "../../components/requestComponents/requestDebugStyle.css";


const OrderMaster = () => {

    return (
        <div className="request-component">
            <div id="min-h-screen pt-12   orderMaster">
            {/* <Link to="/request/write">견적 C</Link> &nbsp;
            <Link to="/request/list">견적 My</Link> &nbsp; */}
                <div><Outlet /></div>
            </div>
        </div>
    );
}
export default OrderMaster;