import React, { useState } from 'react';
import styles from '../styles/UserCreate.module.scss';

const UserCreate = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        userName: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        city: '',
        postalCode: '',
        tags: '',
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user types
        setErrors({ ...errors, [name]: '' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log('Creating customer:', { ...formData, image });
        // Here you can add API call to submit form data
    };

    const handleDiscard = () => {
        setFormData({
            firstName: '',
            userName: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            city: '',
            postalCode: '',
            tags: '',
        });
        setImage(null);
        setErrors({});
    };

    return (
        <div className={styles.container}>
            <h2>Create customer</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.mainGrid}>
                    <div className={styles.leftColumn}>
                        <section className={styles.section}>
                            <h3>Overview</h3>
                            <div className={styles.grid2}>
                                <div>
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                    />
                                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                                </div>
                                <div>
                                    <label>User Name</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div className={styles.fullWidth}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                                </div>
                                <div className={styles.fullWidth}>
                                    <label>Phone number</label>
                                    <div className={styles.phoneInput}>
                                        <div className={styles.countryCode}>
                                            <select
                                                name="countryCode"
                                                onChange={handleInputChange}
                                                style={{ background: 'transparent', border: 'none', outline: 'none', margin: '0' }}
                                            >
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+84">🇻🇳 +84</option>
                                                <option value="+81">🇯🇵 +81</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h3>Address Information</h3>
                            <div className={styles.grid2}>
                                <div className={styles.fullWidth}>
                                    <label>Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="us">🇺🇸 United States</option>
                                        <option value="vn">🇻🇳 Vietnam</option>
                                        <option value="jp">🇯🇵 Japan</option>
                                    </select>
                                </div>
                                <div className={styles.fullWidth}>
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Address"
                                    />
                                </div>
                                <div>
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Postal Code"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={styles.rightColumn}>
                        <section className={styles.section}>
                            <h3>Image</h3>
                            <div className={styles.imageContainer}>
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Uploaded"
                                        className={styles.uploadedImage}
                                    />
                                ) : (
                                    <div className={styles.imageIcon}>
                                        <img src="https://ecme-react.themenate.net/img/others/upload.png" alt="Upload placeholder" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    id="imageUpload"
                                />
                                <button
                                    type="button"
                                    className={styles.uploadBtn}
                                    onClick={() => document.getElementById('imageUpload').click()}
                                >
                                    Upload Image
                                </button>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h3>Customer Tags</h3>
                            <select
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                            >
                                <option value="">Add tags for customer...</option>
                                <option value="VIP">VIP</option>
                                <option value="Regular">Regular</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </section>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button type="button" className={styles.discardBtn} onClick={handleDiscard}>
                        <span className={styles.icon}>🗑️</span>
                        Discard
                    </button>
                    <button type="submit" className={styles.createBtn}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserCreate;