import { Outlet, useOutletContext } from "react-router-dom";

const CommunityPage = () => {
  const parentContext = useOutletContext();

  return (
    <div id="community_page">
      <Outlet context={parentContext} />
    </div>
  );
};
export default CommunityPage;
