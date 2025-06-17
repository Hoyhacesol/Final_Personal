import styles from "./ListComponent.module.css";

const PageComponent = ({ serverData, movePage }) => {

    return (
        <div className={styles.pagination}>
            {serverData.prev ?
                <div className={styles.page_btn} onClick={() => movePage({ page: serverData.prevPage })}>
                    이전
                </div> : <></>
            }

            {serverData.pageNumList.map(pageNum =>
                <div key={pageNum} className={`${styles.page_btn} ${serverData.current === pageNum ? styles.active : ''}`} onClick={() => movePage({ page: pageNum })}>
                    {pageNum}
                </div>
            )}

            {serverData.next ?
                <div className={styles.page_btn} onClick={() => movePage({ page: serverData.nextPage })}>
                    다음
                </div> : <></>
            }
        </div>
    );
}

export default PageComponent;