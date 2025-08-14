import React from "react";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Header.module.scss";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, isCollapsed }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const avatarUrl = storedUser?.avatarUrl || DEFAULT_AVATAR;
  const userName = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : "Guest";
  const userRole = storedUser?.role || "Visitor";

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
      {/* Toggle Button và Search */}
      <div className={styles.leftSection}>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isCollapsed ? (
            <i className="fa-solid fa-bars"></i>
          ) : (
            <i className="fa-solid fa-bars-staggered"></i>
          )}
        </button>

        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            placeholder="Search [CTRL + K]"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.topIcons}>
        {/* Language */}
        <div className={styles.dropdown}>
          <span className={styles.icon} onClick={() => toggleDropdown("lang")}>
            <i className="fa-solid fa-language"></i>
          </span>
          {activeDropdown === "lang" && (
            <ul className={styles.dropdownMenu}>
              <li>English</li>
              <li>Vietnamese</li>
              <li>Japanese</li>
            </ul>
          )}
        </div>

        {/* Theme */}
        <div className={styles.dropdown}>
          <span className={styles.icon} onClick={() => toggleDropdown("theme")}>
            <i className="fa-regular fa-sun"></i>
          </span>
          {activeDropdown === "theme" && (
            <ul className={styles.dropdownMenu}>
              <li>
                <i className="fa-regular fa-sun"></i> Light
              </li>
              <li>
                <i className="fa-solid fa-moon"></i> Dark
              </li>
              <li>
                <i className="fa-solid fa-desktop"></i> System
              </li>
            </ul>
          )}
        </div>

        {/* Notification */}
        <div className={styles.dropdown}>
          <span
            className={styles.icon}
            onClick={() => toggleDropdown("notify")}
          >
            <i className="fa-regular fa-bell"></i>
          </span>
          <span className={styles.dot}></span>
          {activeDropdown === "notify" && (
            <ul className={styles.dropdownMenu}>
              <li>New message from Alice</li>
              <li>System update</li>
              <li>Server warning</li>
            </ul>
          )}
        </div>

        {/* Avatar */}
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
              {/* Header */}
              <div className={styles.userInfo}>
                <img src={avatarUrl} alt="User" />
                <div>
                  <div className={styles.userName}>{userName}</div>
                  <div className={styles.userRole}>{userRole}</div>
                </div>
              </div>


              {/* Menu Items */}
              <ul className={styles.userList}>
                <li>
                  <i className="fa-regular fa-user"></i> My Profile
                </li>
                <li>
                  <i className="fa-solid fa-gear"></i> Settings
                </li>
              </ul>

              {/* Logout Button */}
              <button className={styles.logout} onClick={() => navigate(`/sign-in`)}>
                Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}