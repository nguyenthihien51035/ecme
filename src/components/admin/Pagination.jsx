import React from "react";
import styles from "../../styles/admin/Pagination.module.scss";

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.info}>
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalElements)} of {totalElements} entries
      </div>

      <div className={styles.pages}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {"‹"}
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={currentPage === idx + 1 ? styles.active : ""}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {"›"}
        </button>
      </div>

      <div>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="5">5 / Page</option>
          <option value="10">10 / Page</option>
          <option value="20">20 / Page</option>
          <option value="50">50 / Page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
