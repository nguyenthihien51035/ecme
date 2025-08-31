import React, { useState } from 'react';
import styles from '../../styles/admin/SideBar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import logoFull from '../../assets/img/logo-light-full.png';
import logoSmall from '../../assets/img/logo-light-streamline.png'

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [openDropdowns, setOpenDropdowns] = useState({});

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
            hasDropdown: true,
            submenu: [
                {
                    key: 'customer-list',
                    label: 'List',
                    path: '/admin/customer/list'
                },
                {
                    key: 'customer-create',
                    label: 'Create',
                    path: '/admin/customer/create'
                }
            ]
        },
        {
            key: 'products',
            icon: 'fa-solid fa-box',
            label: 'Products',
            hasDropdown: true,
            submenu: [
                {
                    key: 'products-list',
                    label: 'List',
                    path: '/admin/products/list'
                },
                {
                    key: 'products-create',
                    label: 'Create',
                    path: '/admin/products/create'
                }
            ]
        },
    ];

    const isActiveItem = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const toggleDropdown = (key) => {
        if (isCollapsed) return; // Don't show dropdown when sidebar is collapsed

        setOpenDropdowns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleMenuItemClick = (item) => {
        if (item.hasDropdown && !isCollapsed) {
            toggleDropdown(item.key);
        } else {
            // If collapsed or no dropdown, navigate to main path
            navigate(item.path);
        }
    };

    const handleSubmenuClick = (submenuItem) => {
        navigate(submenuItem.path);
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
                        <div key={item.key}>
                            <div
                                className={`${styles.menuItem} ${item.key === 'dashboard' ? styles.categoryHeader : ''
                                    } ${isActiveItem(item.path) ? styles.active : ''} ${item.hasDropdown && openDropdowns[item.key] ? styles.expanded : ''}`}
                                onClick={() => handleMenuItemClick(item)}
                            >
                                <i className={item.icon}></i>
                                {!isCollapsed && <span>{item.label}</span>}
                                {item.hasDropdown && !isCollapsed && (
                                    <i className={`fa-solid fa-chevron-${openDropdowns[item.key] ? 'up' : 'down'} ${styles.dropdownArrow}`}></i>
                                )}
                            </div>

                            {/* Submenu */}
                            {item.hasDropdown && !isCollapsed && openDropdowns[item.key] && (
                                <div className={styles.submenu}>
                                    {item.submenu.map(submenuItem => (
                                        <div
                                            key={submenuItem.key}
                                            className={`${styles.submenuItem} ${isActiveItem(submenuItem.path) ? styles.active : ''}`}
                                            onClick={() => handleSubmenuClick(submenuItem)}
                                        >
                                            <span>{submenuItem.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}