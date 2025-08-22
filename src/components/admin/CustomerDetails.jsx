import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/admin/CustomerDetails.module.scss';
import { Edit, ArrowLeft, Phone, Mail, Shield, ShieldCheck, ShieldX, User, Calendar, MapPin, Award, Loader } from 'lucide-react';

export default function CustomerDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8080/api/v1/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải thông tin người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleDisableAccount = async () => {
        if (!window.confirm("Bạn có chắc muốn vô hiệu hóa tài khoản này?")) return;

        try {
            setIsDisabling(true);
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Vô hiệu hóa người dùng thành công!");
            navigate(-1);
            // Optionally reload data to update status
            await fetchUser();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Vô hiệu hóa thất bại");
        } finally {
            setIsDisabling(false);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading state
    if (isLoading || !user) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingCard}>
                    <div className={styles.loadingContent}>
                        <Loader className={styles.loadingSpinner} />
                        <p className={styles.loadingText}>Đang tải thông tin người dùng...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Header with Back Button */}
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                </button>

                {/* Main Content */}
                <div className={styles.mainCard}>
                    {/* Header Section */}
                    <div className={styles.headerSection}>
                        <div className={styles.editButtonContainer}>
                            <button
                                className={styles.editButton}
                                onClick={() => navigate(`/user/edit/${id}`)}
                            >
                                <Edit size={20} />
                            </button>
                        </div>

                        <div className={styles.profileContainer}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatarWrapper}>
                                    <img
                                        src={user.avatarUrl || "https://i.pinimg.com/1200x/20/8c/7e/208c7e8db0901f43c6959553abe0a4d6.jpg"}
                                        alt={user.firstName}
                                        className={styles.avatar}
                                        onError={(e) => {
                                            e.target.src = "https://i.pinimg.com/1200x/20/8c/7e/208c7e8db0901f43c6959553abe0a4d6.jpg";
                                        }}
                                    />
                                </div>
                                <div className={`${styles.statusBadge} ${user.active ? styles.active : styles.inactive}`}>
                                    {user.active ? <ShieldCheck size={20} /> : <ShieldX size={20} />}
                                </div>
                            </div>

                            <div className={styles.profileInfo}>
                                <h1 className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className={styles.userRole}>
                                    <Award size={16} />
                                    <span>{user.role || "User"}</span>
                                </div>
                                {user.address && (
                                    <div className={styles.userLocation}>
                                        <MapPin size={16} />
                                        <span>{user.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className={styles.contentSection}>
                        <div className={styles.contentGrid}>
                            {/* Contact Information */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionHeader}>
                                    <User size={20} className={`${styles.sectionIcon} ${styles.contact}`} />
                                    Thông tin liên hệ
                                </h2>

                                <div className={styles.infoList}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoHeader}>
                                            <div className={`${styles.infoIconWrapper} ${styles.email}`}>
                                                <Mail size={16} />
                                            </div>
                                            <span className={styles.infoLabel}>Email</span>
                                        </div>
                                        <p className={styles.infoValue}>{user.email}</p>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoHeader}>
                                            <div className={`${styles.infoIconWrapper} ${styles.phone}`}>
                                                <Phone size={16} />
                                            </div>
                                            <span className={styles.infoLabel}>Điện thoại</span>
                                        </div>
                                        <p className={styles.infoValue}>{user.phone || "Chưa cập nhật"}</p>
                                    </div>

                                    {user.createdAt && (
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoHeader}>
                                                <div className={`${styles.infoIconWrapper} ${styles.date}`}>
                                                    <Calendar size={16} />
                                                </div>
                                                <span className={styles.infoLabel}>Ngày tham gia</span>
                                            </div>
                                            <p className={styles.infoValue}>{formatDate(user.createdAt)}</p>
                                        </div>
                                    )}

                                    {user.id && (
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoHeader}>
                                                <div className={`${styles.infoIconWrapper} ${styles.id}`}>
                                                    <Shield size={16} />
                                                </div>
                                                <span className={styles.infoLabel}>ID</span>
                                            </div>
                                            <p className={styles.infoValue}>{user.id}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Status & Actions */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionHeader}>
                                    <Shield size={20} className={`${styles.sectionIcon} ${styles.account}`} />
                                    Trạng thái tài khoản
                                </h2>

                                {/* Status Card */}
                                <div className={`${styles.statusCard} ${user.active ? styles.active : styles.inactive}`}>
                                    <div className={styles.statusHeader}>
                                        <div className={styles.statusInfo}>
                                            {user.active ? (
                                                <ShieldCheck className={`${styles.statusIcon} ${styles.active}`} size={24} />
                                            ) : (
                                                <ShieldX className={`${styles.statusIcon} ${styles.inactive}`} size={24} />
                                            )}
                                            <div className={styles.statusDetails}>
                                                <p className={styles.statusTitle}>
                                                    {user.active ? 'Tài khoản hoạt động' : 'Tài khoản bị vô hiệu hóa'}
                                                </p>
                                                <p className={styles.statusDescription}>
                                                    {user.active
                                                        ? 'Người dùng có thể truy cập đầy đủ chức năng'
                                                        : 'Quyền truy cập đã bị hạn chế'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`${styles.statusLabel} ${user.active ? styles.active : styles.inactive}`}>
                                            {user.active ? 'Hoạt động' : 'Bị khóa'}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles.actionButtons}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => navigate(`/admin/customer/edit/${id}`)}
                                    >
                                        <Edit size={16} />
                                        Chỉnh sửa thông tin
                                    </button>

                                    {user.active && (
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={handleDisableAccount}
                                            disabled={isDisabling}
                                        >
                                            {isDisabling ? (
                                                <>
                                                    <Loader className={styles.buttonSpinner} />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldX size={16} />
                                                    Vô hiệu hóa tài khoản
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}