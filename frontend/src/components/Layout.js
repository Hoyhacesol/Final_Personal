import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import Chattingicon from "./Chatting";
import ChattingBox from "./ChattingBox";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Nav />
      <div id="wrap">
        <Outlet />
      </div>
      <Chattingicon onClick={() => setChatOpen((prev) => !prev)} />
      {chatOpen && <ChattingBox onClose={() => setChatOpen(false)} />}
      <Footer />
    </>
  );
};

export default Layout;
