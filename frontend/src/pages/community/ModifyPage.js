import { useNavigate } from "react-router-dom";
const ModifyPage = ({ tno }) => {
    const navigate = useNavigate()
    const moveToRead = () => { navigate({ pathname: `/community/read/${tno}` }) }
    const moveToList = () => { navigate({ pathname: `/community/list` }) }
    return (
        <div id="modifyPage"> community Modify Page </div>
    );
}
export default ModifyPage;
