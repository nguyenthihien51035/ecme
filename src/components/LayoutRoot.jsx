import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../components/SideBar';
import Footer from './Footer';
import styles from '../styles/LayoutRoot.module.scss';

export default function LayoutRoot() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

        <div className={styles.pageContent}>
          <Outlet context={{ isCollapsed, toggleSidebar }} />
          <Footer />
        </div>
      </div>
    </div>
  );
}