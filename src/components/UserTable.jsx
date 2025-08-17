import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/UserTable.module.scss";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://i.pinimg.com/1200x/20/8c/7e/208c7e8db0901f43c6959553abe0a4d6.jpg";

export default function UserTable() {
  const [users, setUsers] = useState([]);          // chỉ chứa CUSTOMER đã lọc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/v1/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();

      // Lấy mảng người dùng từ data.content
      const all = result?.data?.content;
      const list = Array.isArray(all) ? all : [];

      // Lọc chỉ CUSTOMER
      const customersOnly = list.filter((u) => u.role === "CUSTOMER");

      setUsers(customersOnly);
    } catch (err) {
      console.error(err);
      setError("Unable to load user list.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
          <h2>Customer</h2>
          <div className={styles.actions}>
            {/* Export Button */}
            <div className={styles.exportDropdown} ref={exportRef}>
              <button
                className={styles.export}
                onClick={() => setExportOpen((prev) => !prev)}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i> Download
              </button>
            </div>

            <button
              className={styles.addCustomer}
              onClick={() => navigate(`/user/create`)}
            >
              <i className="fa-solid fa-user-plus"></i> Add User
            </button>
          </div>
        </div>

        <div className={styles.search}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Quick search..."
              className={styles.searchInput}
            // TODO: bạn có thể thêm state và filter client-side tại đây
            />
            <span className={styles.searchIcon}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
          <button className={styles.export}>
            <i className="fa-solid fa-filter"></i> Filter
          </button>
        </div>

        {/* Loading / Error / Empty */}
        {loading && <div className={styles.stateMsg}>Loading...</div>}
        {!loading && error && <div className={styles.stateError}>{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className={styles.stateMsg}>
            There are no CUSTOMER users.
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td className={styles.customer}>
                    <img
                      src={u.avatarUrl || DEFAULT_AVATAR}
                      alt={`${u.firstName} ${u.lastName}`}
                      className={styles.avatar}
                    />
                    <div className={styles.name}>
                      {u.firstName} {u.lastName}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td >
                    <span className={u.active ? styles.statusActive : styles.statusBlocked}>
                      {u.active ? 'Active' : 'Blocked'}</span>
                  </td>
                  <td className={styles.actionIcon}>
                    <i
                      className="fa-solid fa-pen-to-square"
                      title="Edit"
                      onClick={() => navigate(`/user/edit/${u.id}`)}
                    />
                    <i
                      className="fa-solid fa-eye"
                      title="View"
                      onClick={() => navigate(`/user/view/${u.id}`)}
                    />
                    <i
                      className="fa-solid fa-trash-can"
                      title="Delete"
                    // TODO: gắn hàm xóa nếu cần
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination />
    </>
  );
}
