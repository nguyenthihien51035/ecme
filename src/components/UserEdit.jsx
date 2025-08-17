import React, { useState, useEffect } from "react";
import styles from "../styles/UserEdit.module.scss";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy id user từ URL
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        role: "CUSTOMER",
    });
    const [errors, setErrors] = useState({});

    // Gọi API lấy thông tin user
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/users/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) {
                    setFormData({
                        firstName: data.data.firstName || "",
                        lastName: data.data.lastName || "",
                        phone: data.data.phone || "",
                        role: data.data.role || "CUSTOMER",
                    });
                }
            })
            .catch((err) => console.error("Lỗi khi load user:", err));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDiscard = () => {
        setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            role: "CUSTOMER",
        });
        setErrors({});
    };

    const handleSave = () => {
        fetch(`http://localhost:8080/api/v1/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Cập nhật thất bại");
                return res.json();
            })
            .then(() => {
                alert("Cập nhật thành công!");
                navigate(-1);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className={styles.container}>
            <h2>Edit customer</h2>
            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    <section className={styles.section}>
                        <h3>User Info</h3>
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
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Phone number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="USER">CUSTOMER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
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
                    <button
                        type="button"
                        className={styles.discardBtn}
                        onClick={handleDiscard}
                    >
                        <span className={styles.icon}>
                            <i className="fa-solid fa-trash-can"></i>
                        </span>
                        Discard
                    </button>
                    <button
                        type="submit"
                        className={styles.saveBtn}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
