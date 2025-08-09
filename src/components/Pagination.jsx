import React from "react";
import styles from "../styles/Pagination.module.scss";

const Pagination = () => {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.info}>Showing 1 to 10 of 100 entries</div>
      <div className={styles.pages}>
        <button>{"«"}</button>
        <button>{"‹"}</button>
        <button className={styles.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>{"›"}</button>
        <button>{"»"}</button>
      </div>
    </div>
  );
};

export default Pagination;
