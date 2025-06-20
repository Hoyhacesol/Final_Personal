import "../../css/ListPage.css";

const PageComponent = ({ serverData, onPageChange }) => {
    return (
        <div className="pagination">
            {serverData.prev && (
                <div className="page_btn" onClick={() => onPageChange(serverData.prevPage)}>
                    이전
                </div>
            )}
            {serverData.pageNumList.map(pageNum => (
                <div
                    key={pageNum}
                    className={`page_btn ${serverData.current === pageNum ? "active" : ""}`}
                    onClick={() => onPageChange(pageNum)}
                >
                    {pageNum}
                </div>
            ))}
            {serverData.next && (
                <div className="page_btn" onClick={() => onPageChange(serverData.nextPage)}>
                    다음
                </div>
            )}
        </div>
    );
};

export default PageComponent;
