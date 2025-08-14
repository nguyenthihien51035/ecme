import React, { useState } from "react";
import styles from "../styles/SignIn.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [errors, setErrors] = useState({}); // lưu lỗi từng field
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        let timeoutID;

        if (!email.trim()) {
            newErrors.email = "Please enter your email";
        }
        if (!password.trim()) {
            newErrors.password = "Please enter your password";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        clearTimeout(timeoutID);

        try {
            const res = await axios.post("http://localhost:8080/api/v1/users/login", {
                email,
                password
            });

            const user = res.data;
            const userData = res.data.data;

            // Lưu vào localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            if (userData.role !== "ADMIN") {
                setErrors({ account: "You are not allowed to login. Admin only!" });
                timeoutID = setTimeout(() => {
                    setErrors((prev) => ({ ...prev, account: "" }));
                }, 3000);
                return;
            }

            setSuccessMsg("Signin successfully!");
            timeoutID = setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrors({ account: err.response.data.message });
            } else {
                setErrors({ account: "Login failed. Please try again!" });
            }
            setTimeout(() => {
                setErrors((prev) => ({ ...prev, account: "" }));
            }, 3000);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Xóa lỗi của riêng field này
        setErrors((prev) => ({ ...prev, email: "" }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Xóa lỗi của riêng field 
        setErrors((prev) => ({ ...prev, password: "" }));
    };

    return (
        <div className={styles.signInWrapper}>
            <div className="container-fluid h-100" style={{ width: "50%" }}>
                <div className="row h-100">
                    {/* Left Side - Form */}
                    <div className={`col-lg-6 ${styles.leftSide}`}>
                        <div className={styles.formContainer}>
                            {/* Logo */}
                            <div >
                                <img
                                    className={styles.logo}
                                    src="https://ecme-react.themenate.net/img/logo/logo-light-streamline.png"
                                    alt=""
                                />
                            </div>

                            {/* Header */}
                            <div className={styles.header}>
                                <h1 className={styles.title}>Welcome back!</h1>
                                <p className={styles.subtitle}>
                                    Please enter your credentials to sign in!
                                </p>
                            </div>

                            {/* Lỗi tài khoản sai */}
                            {errors.account && <p className={styles.errorMsg}>{errors.account}</p>}

                            {/* Thành công */}
                            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}



                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${styles.input} ${errors.email ? styles.errorInput : ""}`}
                                        value={email}
                                        placeholder="Email"
                                        onChange={handleEmailChange}
                                    />
                                    {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <label className={styles.label}>Password</label>
                                    <div className={styles.passwordWrapper}>
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            className={`form-control ${styles.input} ${styles.passwordInput} ${errors.password ? styles.errorInput : ""}`}
                                            value={password}
                                            placeholder="Password"
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowPwd(!showPwd)}
                                        >
                                            <i
                                                className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}
                                            ></i>
                                        </button>
                                    </div>
                                    {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
                                </div>

                                {/* Forgot Password */}
                                <div className="mb-4">
                                    <Link to="/forgot-password" className={styles.forgotPassword}>
                                        Forgot password
                                    </Link>
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className={`btn w-100 ${styles.signInBtn}`}
                                >
                                    Sign In
                                </button>
                            </form>

                            {/* Divider */}
                            <div className={styles.divider}>
                                <span>or continue with</span>
                            </div>

                            {/* Social Login */}
                            <div className={styles.socialRow}>
                                <button>
                                    <img style={{ width: "25px" }} src="https://ecme-react.themenate.net/img/others/google.png" alt="" />
                                    <span>Google</span>
                                </button>
                                <button>
                                    <img style={{ width: "25px" }} src="https://ecme-react.themenate.net/img/others/github.png" alt="" />
                                    <span>Github</span>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className={styles.signUpLink}>
                                Don't have an account yet?{" "}
                                <Link to="/sign-up" className={styles.signUp} href="">Sign up</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
                <img style={{
                    width: "500px",
                    height: "100%",
                    borderTopRightRadius: "32px",
                    borderBottomRightRadius: "32px",
                }} src="https://ecme-react.themenate.net/img/others/auth-side-bg.png" alt="" />
            </div>
        </div>
    );
}
