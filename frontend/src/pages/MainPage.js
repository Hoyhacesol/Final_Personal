import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div id="mainPage">
      <div>MainPage</div>
      <Link to={"/community"}>커뮤니티 게시판</Link>
    </div>
  );
};

export default MainPage;
