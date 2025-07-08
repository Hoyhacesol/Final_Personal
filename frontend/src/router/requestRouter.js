import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";





const requestRouter = () => {
const Loading = <LoadingSpinner />;

const OrderMyPage = lazy(() => import("../pages/request/OrderMyPage"))
const OrderReadPage = lazy(() => import("../pages/request/OrderReadPage"))
const OrderCreatePage = lazy(() => import("../pages/request/OrderCreatePage"))
const OrderModifyPage = lazy(() => import("../pages/request/OrderModifyPage"))
const BizRegisterPage = lazy(() => import("../pages/biz/BizRegisterPage"))
const BizModifyPage = lazy(() => import("../pages/biz/BizModifyPage"))

    return [
        {   
            path: "list", element: <Suspense fallback={Loading}><OrderMyPage /></Suspense>
        },
        {
            path: "", element: <Navigate replace to="list" />
        },
        {
            path: "read/:ono", element: <Suspense fallback={Loading}><OrderReadPage /></Suspense>
        },
        {
            path: "write", element: <Suspense fallback={Loading}><OrderCreatePage /></Suspense>
        },
        {
            path: "modify/:ono", element: <Suspense fallback={Loading}><OrderModifyPage /></Suspense>
        },
        {
            path: ":ono/bizregister",element: <Suspense fallback={Loading}><BizRegisterPage /></Suspense>
        },
        {
            path: ":ono/bizmodify",element: <Suspense fallback={Loading}><BizModifyPage /></Suspense>
        }
    ]
}
export default requestRouter;
