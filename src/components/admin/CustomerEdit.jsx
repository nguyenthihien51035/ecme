import React, { useState, useEffect } from "react";
import styles from '../../styles/admin/CustomerEdit.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerEdit() {
    const { isCollapsed } = useOutletContext(); // Lấy state từ LayoutRoot
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatarUrl: "",
        role: "CUSTOMER",
        active: true, // mặc định active
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2 || formData.firstName.length > 100) {
            newErrors.firstName = 'First name must be between 2 and 100 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2 || formData.lastName.length > 100) {
            newErrors.lastName = 'Last name must be between 2 and 100 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^0\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must start with 0 and have exactly 10 digits';
        }

        return newErrors;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token"); // token admin
                const res = await axios.get(`http://localhost:8080/api/v1/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data?.data) {
                    const user = res.data.data;
                    setFormData({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        avatarUrl: user.avatarUrl || "",
                        role: user.role || "CUSTOMER",
                        active: user.active ?? true,
                    });

                    if (user.avatarUrl) {
                        setImagePreview(
                            user.avatarUrl.startsWith("http")
                                ? user.avatarUrl
                                : `http://localhost:8080${user.avatarUrl}`
                        );
                    }
                }
            } catch (err) {
                console.error("Lỗi khi load user:", err);
            }
        };

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleDiscard = () => {
        if (window.confirm("Are you sure you want to abandon the changes?")) {
            navigate(-1);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, avatarUrl: "", removeAvatar: true })
        const input = document.querySelector('input[type="file"]');
        if (input) input.value = '';
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, avatarUrl: 'File size must be less than 5MB' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors({ ...errors, avatarUrl: '' });
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        setApiError('');
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("role", formData.role);
            data.append("active", formData.active);

            if (imageFile) {
                data.append("avatar", imageFile);
            } else if (formData.removeAvatar) {
                data.append("removeAvatar", "true");
            }

            await axios.put(`http://localhost:8080/api/v1/users/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            toast.success("Update successfully!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>Edit customer</h2>
            {apiError && (
                <div className={`${styles.section} ${styles.errorBox}`}>
                    <span className={styles.error}>{apiError}</span>
                </div>
            )}

            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    {/* Personal Information */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Overview</h3>
                        <div className={styles.grid2}>
                            <div>
                                <label className={styles.label}>First Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    className={styles.input}
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </div>
                            <div>
                                <label className={styles.label}>Last Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    className={styles.input}
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Contact Information</h3>
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Email <span style={{ color: 'red' }}>*</span></label>
                            <input
                                className={styles.input}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Phone <span style={{ color: 'red' }}>*</span></label>
                            <div className={styles.phoneInput}>
                                <div className={styles.countryCode}>+84</div>
                                <input
                                    className={`${styles.input} ${styles.flex1}`}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                            </div>
                        </div>
                        {/* Status */}
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Status</label>
                            <select
                                name="active"
                                value={formData.active ? "true" : "false"}
                                onChange={(e) =>
                                    setFormData({ ...formData, active: e.target.value === "true" })
                                }
                                className={styles.input}
                            >
                                <option value="true" style={{ borderRadius: '10px' }}>Active</option>
                                <option value="false">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    {/* Avatar Upload */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Avatar</h3>
                        <div className={styles.imageContainer}>
                            {imagePreview ? (
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className={styles.uploadedImage}
                                    />
                                    <button onClick={removeImage} className={styles.removeImageBtn}>×</button>
                                </div>
                            ) : (
                                <div className={styles.imageIcon}>📷</div>
                            )}
                            <label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <span className={styles.uploadBtn}>
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                </span>
                            </label>
                            {errors.avatarUrl && <span className={styles.error}>{errors.avatarUrl}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`${styles.actionButtons} ${isCollapsed ? styles.collapsed : ''}`}>
                <div className={styles.leftActions}>
                    <span className={styles.back} onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i>
                        <span> Back</span>
                    </span>
                </div>
                <div className={styles.rightActions}>
                    <button type="button" className={styles.discardBtn} onClick={handleDiscard}>
                        <span className={styles.icon}><i className="fa-solid fa-trash-can"></i></span>
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className={`${styles.createBtn} ${isSubmitting ? styles.disabled : ''}`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update User'}
                    </button>
                </div>
            </div>
        </div>
    );
}
