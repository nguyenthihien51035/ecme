import React, { useState } from "react";
import styles from "../../styles/admin/SignIn.module.scss";
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
            // Gọi API login
            const loginRes = await axios.post("http://localhost:8080/api/v1/users/login", {
                email,
                password
            });
            const token = loginRes.data.data;
            console.log("Login token received:", token); // Debug token
            localStorage.setItem("token", token); // Lưu token vào localStorage

            // Gọi API /me để lấy thông tin người dùng
            const userRes = await axios.get("http://localhost:8080/api/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data from /me:", userRes.data); // Debug user data
            const userData = userRes.data.data; // Giả sử API /me trả về user data trong userRes.data.data
            localStorage.setItem("user", JSON.stringify(userData)); // Lưu user info vào localStorage

            // Kiểm tra role từ dữ liệu người dùng
            if (userData.role !== "ADMIN") {
                setErrors({ account: "You are not allowed to login. Admin only!" });
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                timeoutID = setTimeout(() => {
                    setErrors((prev) => ({ ...prev, account: "" }));
                }, 3000);
                return;
            }

            setSuccessMsg("Signin successfully!");
            timeoutID = setTimeout(() => {
                navigate("/admin");
            }, 1000);
        } catch (err) {
            console.error("Login error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            }); // Debug lỗi chi tiết
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        setErrors({ account: "Unauthorized. Please check your credentials!" });
                        break;
                    case 403:
                        setErrors({ account: "Forbidden. " + (err.response.data?.message || "Check CORS, token, or permissions!") });
                        break;
                    default:
                        setErrors({ account: err.response.data?.message || "Login failed. Please try again!" });
                }
            } else {
                setErrors({ account: "Network error. Please try again!" });
            }
            setTimeout(() => {
                setErrors((prev) => ({ ...prev, account: "" }));
            }, 3000);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors((prev) => ({ ...prev, email: "" }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrors((prev) => ({ ...prev, password: "" }));
    };

    return (
        <div className={styles.signInWrapper}>
            <div className="container-fluid h-100" style={{ width: "50%" }}>
                <div className="row h-100">
                    <div className={styles.leftSide}>
                        <div className={styles.formContainer}>
                            {/* <div>
                                <img
                                    className={styles.logo}
                                    src="https://bizweb.dktcdn.net/100/462/587/themes/880841/assets/favicon.png?1724310613023"
                                    alt=""
                                />
                            </div> */}
                            <div className={styles.header}>
                                <h1 className={styles.title}>Welcome back!</h1>
                                <p className={styles.subtitle}>
                                    Please enter your credentials to sign in!
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
                                        onChange={handleEmailChange}
                                    />
                                    {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                                </div>
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
                                <div className="mb-4">
                                    <Link to="/admin/forgot-password" className={styles.forgotPassword}>
                                        Forgot password
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className={`btn w-100 ${styles.signInBtn}`}
                                >
                                    Sign In
                                </button>
                            </form>
                            <div className={styles.divider}>
                                <span>or continue with</span>
                            </div>
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
                            <div className={styles.signUpLink}>
                                Don't have an account yet?{" "}
                                <Link to="/admin/sign-up" className={styles.signUp} href="">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-none d-lg-block">
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