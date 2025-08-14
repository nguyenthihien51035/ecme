import React, { useState } from 'react';
import styles from '../styles/UserEdit.module.scss';
import { useNavigate } from 'react-router-dom';

export default function UserEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy id user từ URL
    const [banned, setBanned] = useState(false);
    const [verified, setVerified] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        role: "CUSTOMER",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

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
            <h2>Edit user</h2>
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
                                />
                            </div>
                            <div>
                                <label>User Name</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <label>Phone number</label>
                                <div className={styles.phoneInput}>
                                    <span>🇺🇸 +1</span>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Address Information */}
                    <section className={styles.section}>
                        <h3>Address Information</h3>
                        <div className={styles.grid2}>
                            <div className={styles.fullWidth}>
                                <label>Country</label>
                                <select>
                                    <option>🇺🇸 United States</option>
                                </select>
                            </div>
                            <div className={styles.fullWidth}>
                                <label>Address</label>
                                <input type="text" value="123 Main St" />
                            </div>
                            <div>
                                <label>City</label>
                                <input type="text" value="New York" />
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input type="text" value="10001" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Section */}
                <div className={styles.rightColumn}>
                    {/* Image */}
                    <section className={styles.section}>
                        <h3>Image</h3>
                        <div className={styles.imageContainer}>
                            <div className={styles.imageCenter}>
                                <img
                                    src="https://randomuser.me/api/portraits/women/75.jpg"
                                    alt="profile"
                                />
                            </div>
                            <button className={styles.uploadBtn}>Upload Image</button>
                        </div>
                    </section>

                    {/* Tags */}
                    <section className={styles.section}>
                        <h3>Customer Tags</h3>
                        <select>
                            <option>Add tags for customer...</option>
                        </select>
                    </section>

                    {/* Account Status */}
                    <section className={styles.section}>
                        <h3>Account</h3>
                        <div className={styles.toggleRow}>
                            <label>Banned</label>
                            <input
                                type="checkbox"
                                checked={banned}
                                onChange={() => setBanned(!banned)}
                            />
                        </div>
                        <div className={styles.toggleRow}>
                            <label>Account Verified</label>
                            <input
                                type="checkbox"
                                checked={verified}
                                onChange={() => setVerified(!verified)}
                            />
                        </div>
                    </section>
                </div>
            </div>

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
                    <button type="submit" className={styles.saveBtn}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
