import { Outlet } from "react-router-dom";
import "../../css/CommunityPage.css";

const CommunityPage = () => {
    return (
        <div id="community_page">
            <Outlet />
        </div>
    );
}
export default CommunityPage;