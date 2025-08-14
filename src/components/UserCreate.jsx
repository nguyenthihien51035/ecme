import React, { useState } from 'react';
import styles from '../styles/UserCreate.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setApiError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, avatar: 'File size must be less than 5MB' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors({ ...errors, avatar: '' });
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        const input = document.querySelector('input[type="file"]');
        if (input) input.value = '';
    };

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

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (
            !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
                .test(formData.password)
        ) {
            newErrors.password = 'Password must have at least 6 characters, including uppercase, lowercase, number, and special character';
        }

        return newErrors;
    };

    const handleSubmit = async () => {
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
            data.append("password", formData.password);
            if (imageFile) {
                data.append("avatar", imageFile);
            }

            await axios.post(
                "http://localhost:8080/api/v1/users",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert('User created successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: ''
            });
            removeImage();
            setErrors({});
        } catch (error) {
            if (error.response && error.response.data) {
                setApiError(error.response.data.message || "Failed to create user. Please try again.");
            } else {
                setApiError("Failed to create user. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = () => {
        if (Object.values(formData).some(value => value.trim()) || imageFile) {
            if (window.confirm('Are you sure you want to discard all changes?')) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: ''
                });
                removeImage();
                setErrors({});
                setApiError('');
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>Create User</h2>

            {apiError && (
                <div className={`${styles.section} ${styles.errorBox}`}>
                    <span className={styles.error}>{apiError}</span>
                </div>
            )}

            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    {/* Personal Information */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Personal Information</h3>
                        <div className={styles.grid2}>
                            <div>
                                <label className={styles.label}>First Name</label>
                                <input
                                    className={styles.input}
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </div>
                            <div>
                                <label className={styles.label}>Last Name</label>
                                <input
                                    className={styles.input}
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Contact Information</h3>
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Email</label>
                            <input
                                className={styles.input}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                            />
                            {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Phone</label>
                            <div className={styles.phoneInput}>
                                <div className={styles.countryCode}>+84</div>
                                <input
                                    className={`${styles.input} ${styles.flex1}`}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>
                    </div>

                    {/* Security */}
                    <div className={styles.section}>
                        <h3 className={styles.h3}>Security</h3>
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter password"
                            />
                            {errors.password && <span className={styles.error}>{errors.password}</span>}
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
                            {errors.avatar && <span className={styles.error}>{errors.avatar}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
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
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`${styles.createBtn} ${isSubmitting ? styles.disabled : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
}
