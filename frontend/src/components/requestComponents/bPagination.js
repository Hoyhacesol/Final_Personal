import React from 'react';

const Pagination = ({ current, size, totalCount, onPageChange, prev, next }) => {
  const totalPages = Math.ceil(totalCount / size);

  return (
    <div className="rq-paging-container">
      <button
        className="rq-paging-btn"
        onClick={() => onPageChange(current - 1)}
        disabled={!prev}
      >
        Prev
      </button>

      <div className="font-semibold">
        {current} / {totalPages}
      </div>

      <button
        className="rq-paging-btn"
        onClick={() => onPageChange(current + 1)}
        disabled={!next}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
