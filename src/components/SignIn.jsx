import React, { useState } from "react";
import styles from "../styles/SignIn.module.scss";
import { Link } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password });
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

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${styles.input}`}
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <label className={styles.label}>Password</label>
                                    <div className={styles.passwordWrapper}>
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            className={`form-control ${styles.input} ${styles.passwordInput}`}
                                            value={password}
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
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
