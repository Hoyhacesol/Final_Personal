import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import communityRouter from "../router/communityRouter";
import sellerRouter from "../router/sellerRouter";
import requestRouter from "../router/requestRouter";
import ErrorPage from "../pages/ErrorPage";
import Socialgowhere from "../components/Socialgowhere";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/community/CommunityPage"));
const Login = lazy(() => import("../pages/login/LoginPage"));
const PreSignup = lazy(() => import("../pages/login/PreSignupPage"));
const PreSignupSeller = lazy(() => import("../pages/login/PreSignupPageSeller"));
const Signup = lazy(() => import("../pages/login/SignupPage"));
const SignupSeller = lazy(() => import("../pages/login/SignupPageSeller"));
const Request = lazy(() => import("../pages/request/OrderMaster"));
const MyPage = lazy(() => import("../pages/mypage/MyPage"));
const Updateinfo = lazy(() => import("../pages/mypage/Updateinfo"));
const UpdateinfoSocial = lazy(() => import("../pages/mypage/UpdateinfoSocial"));
const Findinfo = lazy(() => import("../pages/login/Findinfo"));
const Help = lazy(() => import("../pages/help/HelpPage"));
const OrderList = lazy ( () => import("../pages/request/OrderListPage"))
const SellerModifyPage = lazy(() => import("../pages/seller/SellerModifyPage"));


const Loading = <LoadingSpinner />;
const root = createBrowserRouter([
  //주석:: 로그인,회원가입은 네비게이션 바 미적용
  {
    path: "login",
    element: (
      <Suspense fallback={Loading}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "signup",
    element: (
      <Suspense fallback={Loading}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "presignup",
    element: (
      <Suspense fallback={Loading}>
        <PreSignup />
      </Suspense>
    ),
  },
  {
    path: "presignupseller",
    element: (
      <Suspense fallback={Loading}>
        <PreSignupSeller />
      </Suspense>
    ),
  },
  {
    path: "signupseller",
    element: (
      <Suspense fallback={Loading}>
        <SignupSeller />
      </Suspense>
    ),
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={Loading}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
      {
        path: "community",
        element: (
          <Suspense fallback={Loading}>
            <Community />
          </Suspense>
        ),
        children: communityRouter(),
      },
      {
        path: "request",
        element: (
          <Suspense fallback={Loading}>
            <Request />
          </Suspense>
        ),
        children: requestRouter(),
      },
      {
        path: "sellerlist",
        children: sellerRouter(),
      },
      {
        path: "sellermodify",
        element: (
          <Suspense fallback={Loading}>
            <SellerModifyPage />
          </Suspense>
        ),
      },
      {
        path: "orderlist",
        element: (
          <Suspense fallback={Loading}>
            <OrderList />
          </Suspense>
        ),
      },
      {
        path: "mypage",
        element: (
          <Suspense fallback={Loading}>
            <MyPage />
          </Suspense>
        ),
      },
      {
        path: "updateinfo",
        element: (
          <Suspense fallback={Loading}>
            <Updateinfo />
          </Suspense>
        ),
      },
      {
        path: "updateinfosocial",
        element: (
          <Suspense fallback={Loading}>
            <UpdateinfoSocial />
          </Suspense>
        ),
      },
      {
        path: "findinfo",
        element: (
          <Suspense fallback={Loading}>
            <Findinfo />
          </Suspense>
        ),
      },
      {
        path: "/socialgowhere",
        element: (
          <Suspense fallback={Loading}>
            <Socialgowhere />
          </Suspense>
        ),
      },
      {
        path: "help",
        element: (
          <Suspense fallback={Loading}>
            <Help />
          </Suspense>
        ),
      },
    ],
  },
]);

export default root;