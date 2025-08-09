import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/UserTable.module.scss";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";


export default function UserTable() {
  const [customers, setCustomers] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    const response = await window.fetch("http://localhost:3001/users");
    const rest = await response.json();
    setCustomers(rest);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <h2>User</h2>
          <div className={styles.actions}>
            <select>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            {/* Export Button + Dropdown */}
            <div className={styles.exportDropdown} ref={exportRef}>
              <button
                className={styles.export}
                onClick={() => setExportOpen((prev) => !prev)}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i> Download
              </button>
            </div>

            <button className={styles.addCustomer} onClick={() => navigate(`/user/create`)}><i className="fa-solid fa-user-plus"></i> Add Customer</button>
          </div>
        </div>
        <div className={styles.search}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Quick search..."
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>

          <button className={styles.export}><i className="fa-solid fa-filter"></i> Filter</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Name <i className="fa-solid fa-sort"></i></th>
              <th>Email <i className="fa-solid fa-sort"></i></th>
              <th>Country <i className="fa-solid fa-sort"></i></th>
              <th>Order <i className="fa-solid fa-sort"></i></th>
              <th>Total Spent <i className="fa-solid fa-sort"></i></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className={styles.customer}>
                  <img src={c.avatar} alt={c.name} className={styles.avatar} />
                  <div>
                    <div className={styles.name}>{c.name}</div>
                    <div className={styles.email}>{c.email}</div>
                  </div>
                </td>
                <td>{c.id}</td>
                <td className={styles.country}>
                  <img src={c.flag} alt={c.country} />
                  {c.country}
                </td>
                <td>{c.orders}</td>
                <td>${c.total.toLocaleString()}</td>
                <td className={styles.actionIcon}>
                  <i className="fa-solid fa-pen-to-square" onClick={() => navigate(`/user/edit/${c.id}`)}></i>
                  <i className="fa-solid fa-eye" onClick={() => navigate(`/user/view/${c.id}`)}></i>
                  <i className="fa-solid fa-trash-can"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
}
