import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/admin/CustomerTable.module.scss";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/1200x/20/8c/7e/208c7e8db0901f43c6959553abe0a4d6.jpg";

export default function CustomerTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state phân trang
  const [page, setPage] = useState(1); // frontend dùng 1-based
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const navigate = useNavigate();

  // kiểm tra quyền truy cập
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null; //Nếu có thì parse từ JSON string -> object, nếu không thì = null

    if (!user || user.role !== "ADMIN") {
      alert("You need to login to access the site")
      // Chưa login hoặc không phải admin
      navigate("/admin/sign-in");
    }
  }, [navigate]);

  // fetch user (có filter, phân trang)
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/v1/users/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          firstName: search || null,
          role: "CUSTOMER",
          page: page - 1, // backend 0-based
          size,
        },
      });

      const data = res.data?.data;
      const list = data?.content || [];

      setUsers(list);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError("Unable to load user list.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // gọi lại khi page, size, search thay đổi
  useEffect(() => {
    fetchUsers();
  }, [page, size, search]);

  // Auto search với debounce 500ms
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1); // reset về trang 1 khi search
      fetchUsers();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User disabled successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failure");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <h2>Customer</h2>
          <div className={styles.actions}>
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
              onClick={() => navigate(`/admin/customer/create`)}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        {!loading && error && (
          <div className={styles.stateError}>{error}</div>
        )}
        {!loading && !error && users.length === 0 && (
          <div className={styles.stateMsg}>There are no CUSTOMER users.</div>
        )}

        {!loading && !error && users.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
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
                    #{u.id}
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
                  <td>
                    <span
                      className={
                        u.active ? styles.statusActive : styles.statusBlocked
                      }
                    >
                      {u.active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className={styles.actionIcon}>
                    <i
                      className={`${styles.actionButton} ${styles.editButton} fa-solid fa-pen-to-square`}
                      title="Edit"
                      onClick={() => navigate(`/admin/customer/edit/${u.id}`)}
                    />
                    <i
                      className={`${styles.actionButton} ${styles.viewButton} fa-solid fa-eye`}

                      title="View"
                      onClick={() => navigate(`/admin/customer/view/${u.id}`)}
                    />
                    <i
                      className={`${styles.actionButton} ${styles.deleteButton} fa-solid fa-trash-can`}
                      title="Deactivate user"
                      onClick={() => handleDelete(u.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={size}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setSize(s);
          setPage(1);
        }}
      />
    </>
  );
}
