const ResultModal = ({ title, content, callbackFn }) => {
    return (
        <div id="ResultModal"
            onClick={() => {
                if (callbackFn) {
                    callbackFn()
                }
            }}>
            <div>
                <div>
                    {title}
                </div>
                <div>
                    {content}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            if (callbackFn) {
                                callbackFn()
                            }
                        }}>Close Modal</button>
                </div>
            </div>
        </div>
    );
}

export default ResultModal;
