import { useSearchParams } from "react-router-dom";

const ListPage = () => {
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") || 1
    const size = queryParams.get("size") || 10

    return (
        <div id="listPage">
            community List Page Component / page = {page} --- size = {size}
        </div>
    );
}
export default ListPage;
