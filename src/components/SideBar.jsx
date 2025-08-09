import React, { useState } from 'react';
import styles from '../styles/Sidebar.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo-light-streamline.png';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (key) => {
        if (isCollapsed) return;
        setActiveDropdown(prev => prev === key ? null : key);
    };

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
            icon: 'fa-solid fa-project-diagram',
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
            icon: 'fa-solid fa-robot',
            label: 'AI',
            hasDropdown: true,
            subItems: ['Machine Learning', 'Neural Networks', 'Deep Learning']
        },
        {
            key: 'projects',
            icon: 'fa-solid fa-folder',
            label: 'Projects',
            hasDropdown: true,
            subItems: ['Web Apps', 'Mobile Apps', 'Desktop Apps']
        },
        {
            key: 'customer',
            icon: 'fa-solid fa-users',
            label: 'Customer',
            hasDropdown: true,
            subItems: [
                { label: 'List', path: '/customer/list' },
                { label: 'Edit', path: '/customer/edit' },
                { label: 'Create', path: '/customer/create' },
                { label: 'Details', path: '/customer/details' }
            ],
            isActive: true
        },
        {
            key: 'products',
            icon: 'fa-solid fa-box',
            label: 'Products',
            hasDropdown: true,
            subItems: ['Electronics', 'Clothing', 'Books']
        }
    ];

    return (
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <img src={logo} alt="Ecme" className={styles.logo} />
                {!isCollapsed && <span className={styles.logoText}>Ecme</span>}
            </div>

            {/* Main Menu */}
            <div className={styles.menuSection}>
                {menuItems.map(item => (
                    <div
                        key={item.key}
                        className={`${styles.menuItem} ${item.key === 'dashboard' ? styles.categoryHeader : ''}`}
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
                    <div key={item.key} className={styles.conceptItem}>
                        <div
                            className={`${styles.conceptMain} ${item.isActive ? styles.active : ''}`}
                            onClick={() => item.hasDropdown ? toggleDropdown(item.key) : navigate(item.path)}
                        >
                            <i className={item.icon}></i>
                            {!isCollapsed && (
                                <>
                                    <span>{item.label}</span>
                                    {item.hasDropdown && (
                                        <i className={`fa-solid fa-chevron-${activeDropdown === item.key ? 'up' : 'down'} ${styles.chevron}`}></i>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Dropdown */}
                        {!isCollapsed && item.hasDropdown && activeDropdown === item.key && (
                            <div className={styles.dropdown}>
                                {item.subItems.map((subItem, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.dropdownItem} ${subItem.label === 'List' ? styles.activeSubItem : ''}`}
                                        onClick={() => navigate(subItem.path || '#')}
                                    >
                                        <i className="fa-solid fa-circle" style={{ fontSize: '4px' }}></i>
                                        <span>{subItem.label || subItem}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}