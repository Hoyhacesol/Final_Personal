import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import Chattingicon from "./Chatting";
import MessengerPanel from "./MessengerPanel";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);

  const openMessengerWithUser = (user) => {
    setChatTarget(user);
    setChatOpen(true);
  };

  return (
    <>
      <Nav />
      <div id="wrap">
        <Outlet context={{ openMessengerWithUser }} />
      </div>
      <Chattingicon onClick={() => setChatOpen((prev) => !prev)} />
      {chatOpen && <MessengerPanel onClose={() => setChatOpen(false)} />}
      <Footer />
    </>
  );
};

export default Layout;
