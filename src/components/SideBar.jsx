import React from 'react';
import styles from '../styles/SideBar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo-light-full.png';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: 'dashboard',
            icon: 'fa-solid fa-chart-line',
            label: 'DASHBOARD',
            path: '/dashboard'
        },
        {
            key: 'ecommerce',
            icon: 'fa-solid fa-shopping-cart',
            label: 'Ecommerce',
            path: '/ecommerce'
        },
        {
            key: 'project',
            icon: 'fa-solid fa-rocket',
            label: 'Project',
            path: '/project'
        },
        {
            key: 'marketing',
            icon: 'fa-solid fa-bullhorn',
            label: 'Marketing',
            path: '/marketing'
        },
        {
            key: 'analytic',
            icon: 'fa-solid fa-chart-bar',
            label: 'Analytic',
            path: '/analytic'
        }
    ];

    const conceptItems = [
        {
            key: 'ai',
            icon: 'fa-solid fa-atom',
            label: 'AI',
            path: '/ai'
        },
        {
            key: 'projects',
            icon: 'fa-solid fa-building',
            label: 'Projects',
            path: '/projects'
        },
        {
            key: 'customer',
            icon: 'fa-solid fa-users',
            label: 'Customer',
            path: '/'
        },
        {
            key: 'products',
            icon: 'fa-solid fa-box',
            label: 'Products',
            path: '/products'
        },
        {
            key: 'orders',
            icon: 'fa-solid fa-shopping-cart',
            label: 'Orders',
            path: '/orders'
        },
        {
            key: 'account',
            icon: 'fa-solid fa-user-circle',
            label: 'Account',
            path: '/account'
        },
        {
            key: 'help',
            icon: 'fa-solid fa-question-circle',
            label: 'Help Center',
            path: '/help'
        },
        {
            key: 'calendar',
            icon: 'fa-solid fa-calendar',
            label: 'Calendar',
            path: '/calendar'
        }
    ];

    const isActiveItem = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Logo Section - Fixed */}
            <div className={styles.logoSection}>
                <img src={logo} alt="Ecme" className={styles.logo} onClick={() => navigate('/')} />
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
                {!isCollapsed && (
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
                </div>
            </div>
        </div>
    );
}