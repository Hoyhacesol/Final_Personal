import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const Layout = () => {
  return (
    <>
      <Nav />
      <div id="wrap">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
