import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const requestRouter = () => {
const Loading = <div>Loading....</div>
const OrderMyPage = lazy(() => import("../pages/request/OrderMyPage"))
const OrderReadPage = lazy(() => import("../pages/request/OrderReadPage"))
const OrderCreatePage = lazy(() => import("../pages/request/OrderCreatePage"))
const OrderModifyPage = lazy(() => import("../pages/request/OrderModifyPage"))

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
        }
    ]
}
export default requestRouter;
