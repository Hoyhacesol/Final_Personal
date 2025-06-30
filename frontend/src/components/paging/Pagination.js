import "../../css/Pagination.css";

const Pagination = ({ current, pageList, prev, next, prevPage, nextPage, onPageChange, className}) => {
  return (
    <div className={`pagination ${className || ""}`}>
      {prev && (
        <button onClick={() => onPageChange(prevPage)}> 이전</button>
      )}
      {pageList.map((num) => (
        <button
          key={num}
          className={num === current ? "active" : ""}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      {next && (
        <button onClick={() => onPageChange(nextPage)}>다음 </button>
      )}
    </div>
  );
};

export default Pagination;
