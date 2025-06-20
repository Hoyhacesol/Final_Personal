import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import communityRouter from "../router/communityRouter";
import sellerRouter from "../router/sellerRouter";
import requestRouter from "../router/requestRouter";
import ErrorPage from "../pages/ErrorPage";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/community/CommunityPage"));
const Login = lazy(() => import("../pages/login/LoginPage"));
const PreSignup = lazy(() => import("../pages/login/PreSignupPage"));
const PreSignupSeller = lazy(() => import("../pages/login/PreSignupPageSeller"));
const Signup = lazy(() => import("../pages/login/SignupPage"));
const SignupSeller = lazy(() => import("../pages/login/SignupPageSeller"));
const Request = lazy(() => import("../pages/request/OrderMaster"));

const Loading = <div>Loading...</div>;
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
    ],
  },
]);

export default root;
