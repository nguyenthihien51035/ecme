import { useState, useEffect } from 'react';
import { User, Shield, Eye, EyeOff, Upload, X } from 'lucide-react';
import styles from "../styles/UserProfile.module.scss";
import axios from 'axios';
import { toast } from "react-toastify";

export default function ProfileSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatarUrl: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileImage, setProfileImage] = useState('/api/placeholder/80/80');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const token = localStorage.getItem("token");

    // Lấy profile user đang đăng nhập
    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get("http://localhost:8080/api/v1/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                const user = res.data.data;
                setProfileData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    avatarUrl: user.avatarUrl || "",
                });

                if (user.avatarUrl) {
                    setProfileImage(
                        user.avatarUrl.startsWith("http")
                            ? user.avatarUrl
                            : `http://localhost:8080${user.avatarUrl}`
                    );
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                toast.error("Không lấy được thông tin người dùng");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, avatarUrl: "File size must be less than 5MB" });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors({ ...errors, avatarUrl: "" });
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setProfileImage("/api/placeholder/80/80");
        setProfileData((prev) => ({ ...prev, avatarUrl: "" }));
    };

    const validateProfile = () => {
        const newErrors = {};
        if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateProfile()) return;
        setIsLoading(true);
        try {
            const res = await axios.put(
                "http://localhost:8080/api/v1/users/profile",
                {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Cập nhật hồ sơ thành công!");
            setProfileData(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Cập nhật thất bại, thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        const newErrors = {};
        if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        try {
            const res = await axios.put(
                "http://localhost:8080/api/v1/users/change-password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message || "Đổi mật khẩu thành công!");
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const sidebarItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    const renderPasswordInput = (name, label, placeholder = '••••••••') => (
        <div className={styles.inputGroup}>
            <label className={styles.label}>
                {label} <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordInputContainer}>
                <input
                    className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
                    type={showPasswords[name] ? 'text' : 'password'}
                    name={name}
                    value={passwordData[name]}
                    onChange={(e) =>
                        setPasswordData(prev => ({ ...prev, [name]: e.target.value }))
                    }
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility(name)}
                >
                    {showPasswords[name] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors[name] && <div className={styles.errorMessage}>{errors[name]}</div>}
        </div>
    );

    return (
        <>
            <h1 className={styles.sidebarTitle}>Settings</h1>
            <div className={styles.container}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                className={`${styles.sidebarItem} ${activeTab === item.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <IconComponent size={20} />
                                {item.label}
                            </div>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {activeTab === 'profile' && (
                        <div>
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Personal information</h2>

                                <div className={styles.avatarSection}>
                                    <img
                                        src={imagePreview || profileImage}
                                        alt="Profile"
                                        className={styles.avatar}
                                    />
                                    <div className={styles.avatarActions}>
                                        <label className={styles.uploadBtn}>
                                            <Upload size={16} />
                                            Upload Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <button type="button" onClick={removeImage} className={styles.removeBtn}>
                                            <X size={16} /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.grid2}>
                                    <div>
                                        <label className={styles.label}>
                                            First Name <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleProfileChange}
                                        />
                                        {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                                    </div>

                                    <div>
                                        <label className={styles.label}>
                                            Last Name <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleProfileChange}
                                        />
                                        {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label className={styles.label}>
                                        Email <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className={styles.label}>
                                        Phone number <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                        type="text"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                    />
                                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                </div>
                            </div>

                            <div className={styles.actionSection}>
                                <button onClick={handleSave} className={styles.saveBtn} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Password</h2>
                            <p className={styles.sectionSubtitle}>
                                Remember, your password is your digital key to your account. Keep it safe, keep it secure!
                            </p>

                            {renderPasswordInput('currentPassword', 'Current password')}
                            {renderPasswordInput('newPassword', 'New password')}
                            {renderPasswordInput('confirmPassword', 'Confirm new password')}

                            <div className={styles.passwordHint}>
                                <p>Password must contain:</p>
                                <ul>
                                    <li>At least 8 characters</li>
                                    <li>At least one uppercase letter</li>
                                    <li>At least one lowercase letter</li>
                                    <li>At least one number</li>
                                </ul>
                            </div>

                            <div className={styles.actionSection}>
                                <button
                                    onClick={handleUpdatePassword}
                                    className={styles.saveBtn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
