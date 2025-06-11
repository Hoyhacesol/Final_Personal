import { useCallback } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";


const ReadPage = () => {
    const { tno } = useParams()
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10
    const queryStr = createSearchParams({ page, size }).toString()
    const moveToModify = useCallback((tno) => { navigate({ pathname: `/community/modify/${tno}`, search: queryStr }) }, [tno, page, size])


    return (
        <div id="readPage">
            community Read Page Component {tno}
            <button onClick={() => moveToModify(tno)}>Test Modify</button>
        </div>
    );
}
export default ReadPage;