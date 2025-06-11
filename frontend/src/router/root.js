import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import communityRouter from "../router/communityRouter";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/community/CommunityPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Signup = lazy(() => import("../pages/SignupPage"));
const Signups = lazy(() => import("../pages/SignupPageSeller"));

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
    path: "signups",
    element: (
      <Suspense fallback={Loading}>
        <Signups />
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
        path: "community",
        element: (
          <Suspense fallback={Loading}>
            <Community />
          </Suspense>
        ),
        children: communityRouter(),
      },
    ],
  },
]);

export default root;
