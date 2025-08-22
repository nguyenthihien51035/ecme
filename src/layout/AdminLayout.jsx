import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/SideBar';
import Header from '../components/admin/Header';
import Footer from '../components/admin/Footer';
import styles from '../styles/admin/LayoutRoot.module.scss';

export default function AdminLayout() {
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