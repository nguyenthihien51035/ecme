import React from "react";
import styles from "../styles/Pagination.module.scss";

const Pagination = () => {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.info}>Showing 1 to 10 of 100 entries</div>

      <div className={styles.pages}>
        <button>{"‹"}</button>
        <button className={styles.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>{"›"}</button>
      </div>

      <div className="">
        <select defaultValue="10">
          <option value="10">10 / Page</option>
          <option value="25">25 / Page</option>
          <option value="50">50 / Page</option>
          <option value="100">100 / Page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
