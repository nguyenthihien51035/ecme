import React, { useState } from "react";
import styles from "../../styles/admin/ForgotPassword.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Please enter your email";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await axios.post("http://localhost:8080/api/v1/users/forgot-password", {
                email: email,
            });
            setSuccessMsg(res.data.message || "Verification code has been sent to your email!");
            setTimeout(() => {
                navigate("/reset-password");
            }, 2000);
        } catch (err) {
            console.error("Forgot password error:", err.response?.data || err.message);
            setErrors({ account: err.response?.data?.message || "Something went wrong. Please try again!" });
        }
    };

    return (
        <div className={styles.signInWrapper}>
            <div className="container-fluid h-100" style={{ width: "50%" }}>
                <div className="row h-100">
                    <div className={`col-lg-6 ${styles.leftSide}`}>
                        <div className={styles.formContainer}>

                            <div className={styles.header}>
                                <h1 className={styles.title}>Forgot Password</h1>
                                <p className={styles.subtitle}>
                                    Please enter your email to receive a verification code
                                </p>
                            </div>
                            {errors.account && <p className={styles.errorMsg}>{errors.account}</p>}
                            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${styles.input} ${errors.email ? styles.errorInput : ""}`}
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                                </div>
                                <button type="submit" className={`btn w-100 ${styles.signInBtn}`}>
                                    Submit
                                </button>
                            </form>

                            <div className={styles.signUpLink}>
                                <span style={{ color: '#737373' }}>Back to </span><Link to="/admin/sign-in" className={styles.signUp}>Sign in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ảnh bên phải */}
            <div className="col-lg-6 d-none d-lg-block">
                <img
                    style={{
                        width: "500px",
                        height: "100%",
                        borderTopRightRadius: "32px",
                        borderBottomRightRadius: "32px",
                    }}
                    src="https://ecme-react.themenate.net/img/others/auth-side-bg.png"
                    alt="background"
                />
            </div>
        </div>
    );
}
