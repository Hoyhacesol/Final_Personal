import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";


const communityRouter = () => {
const Loading = <LoadingSpinner />;
const CommunityList = lazy(() => import("../pages/community/ListPage"))
const CommunityRead = lazy(() => import("../pages/community/ReadPage"))
const CommunityWrite = lazy(() => import("../pages/community/WritePage"))
const CommunityModify = lazy(() => import("../pages/community/ModifyPage"))

    return [
        {
            path: "list", element: <Suspense fallback={Loading}><CommunityList /></Suspense>
        },
        {
            path: "", element: <Navigate replace to="list" />
        },
        {
            path: "read/:pno", element: <Suspense fallback={Loading}><CommunityRead /></Suspense>
        },
        {
            path: "write", element: <Suspense fallback={Loading}><CommunityWrite /></Suspense>
        },
        {
            path: "modify/:pno", element: <Suspense fallback={Loading}><CommunityModify /></Suspense>
        }
    ]
}
export default communityRouter;
