import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/admin/Header.module.scss";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, isCollapsed }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const avatarUrl = storedUser.avatarUrl || DEFAULT_AVATAR;
  const userName = storedUser.firstName && storedUser.lastName ? `${storedUser.firstName} ${storedUser.lastName}` : "Guest";
  const userRole = storedUser.role || "Visitor";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };


  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isCollapsed ? (
            <i className="fa-solid fa-bars"></i>
          ) : (
            <i className="fa-solid fa-bars-staggered"></i>
          )}
        </button>
      </div>
      <div className={styles.topIcons}>
        <div className={styles.dropdown}>
          <div
            className={styles.avatarWrapper}
            onClick={() => toggleDropdown("user")}
          >
            <img src={avatarUrl} alt="User Avatar" />
            <span className={styles.statusDot}></span>
          </div>
          {activeDropdown === "user" && (
            <div className={styles.userMenu} ref={dropdownRef}>
              <div className={styles.userInfo}>
                <img src={avatarUrl} alt="User" />
                <div>
                  <div className={styles.userName}>{userName}</div>
                  <div className={styles.userRole}>{userRole}</div>
                </div>
              </div>
              <ul className={styles.userList}>
                <li onClick={() => navigate(`/admin/my-profile`)}>
                  <i className="fa-regular fa-user"></i> My Profile
                </li>
                <li onClick={() => navigate(`/admin/my-profile`)}>
                  <i className="fa-solid fa-gear"></i> Settings
                </li>
              </ul>
              <button
                className={styles.logout}
                onClick={() => {
                  localStorage.clear();
                  navigate(`/admin/sign-in`);
                }}
              >
                Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}