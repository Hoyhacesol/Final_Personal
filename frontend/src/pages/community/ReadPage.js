import { useParams } from "react-router-dom";
import ReadComponent from "../../components/community/ReadComponent";

const ReadPage = () => {
    const { pno } = useParams()

    return (
        <ReadComponent key={pno} pno={Number(pno)}></ReadComponent>
    );
}

export default ReadPage;