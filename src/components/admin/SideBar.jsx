import React from 'react';
import styles from '../../styles/admin/SideBar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import logoFull from '../../assets/img/logo-light-full.png';
import logoSmall from '../../assets/img/logo-light-streamline.png'

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: 'dashboard',
            icon: 'fa-solid fa-chart-line',
            label: 'DASHBOARD',
            path: '/admin/dashboard'
        },
        {
            key: 'customer',
            icon: 'fa-solid fa-users',
            label: 'Customer',
            path: '/admin/customer'
        },
        // {
        //     key: 'products',
        //     icon: 'fa-solid fa-box',
        //     label: 'Products',
        //     path: '/products'
        // },
        // {
        //     key: 'orders',
        //     icon: 'fa-solid fa-shopping-cart',
        //     label: 'Orders',
        //     path: '/orders'
        // },
        // {
        //     key: 'account',
        //     icon: 'fa-solid fa-user-circle',
        //     label: 'Account',
        //     path: '/account'
        // },
        // {
        //     key: 'help',
        //     icon: 'fa-solid fa-question-circle',
        //     label: 'Help Center',
        //     path: '/help'
        // },
    ];

    const conceptItems = [
        // {
        //     key: 'ai',
        //     icon: 'fa-solid fa-atom',
        //     label: 'AI',
        //     path: '/ai'
        // },
        // {
        //     key: 'projects',
        //     icon: 'fa-solid fa-building',
        //     label: 'Projects',
        //     path: '/projects'
        // },
        // {
        //     key: 'calendar',
        //     icon: 'fa-solid fa-calendar',
        //     label: 'Calendar',
        //     path: '/calendar'
        // }
    ];

    const isActiveItem = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Logo Section - Fixed */}
            <div className={styles.logoSection} onClick={() => navigate('/admin')}>
                <img
                    src={isCollapsed ? logoSmall : logoFull}
                    alt="Logo"
                    className={styles.logo}
                />
            </div>

            {/* Scrollable Content */}
            <div className={styles.scrollableContent}>
                {/* Main Menu */}
                <div className={styles.menuSection}>
                    {menuItems.map(item => (
                        <div
                            key={item.key}
                            className={`${styles.menuItem} ${item.key === 'dashboard' ? styles.categoryHeader : ''
                                } ${isActiveItem(item.path) ? styles.active : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <i className={item.icon}></i>
                            {!isCollapsed && <span>{item.label}</span>}
                        </div>
                    ))}
                </div>

                {/* Concepts Section */}
                {/* {!isCollapsed && (
                    <div className={styles.conceptsHeader}>CONCEPTS</div>
                )}

                <div className={styles.conceptSection}>
                    {conceptItems.map(item => (
                        <div
                            key={item.key}
                            className={`${styles.conceptItem} ${isActiveItem(item.path) ? styles.active : ''
                                }`}
                            onClick={() => navigate(item.path)}
                        >
                            <i className={item.icon}></i>
                            {!isCollapsed && <span>{item.label}</span>}
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
}