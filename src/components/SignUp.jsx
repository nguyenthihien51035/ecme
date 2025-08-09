import React, { useState } from "react";
import styles from "../styles/SignUp.module.scss";
import { Link } from "react-router-dom";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ username, email, password, confirmPwd });
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
                                <h1 className={styles.title}>Sign Up</h1>
                                <p className={styles.subtitle}>
                                    And lets get started with your free trial
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label className={styles.label}>User name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.input}`}
                                        placeholder="User Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${styles.input}`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className={styles.label}>Password</label>
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        className={`form-control ${styles.input}`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className={styles.label}>Confirm Password</label>
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        className={`form-control ${styles.input}`}
                                        placeholder="Confirm Password"
                                        value={confirmPwd}
                                        onChange={(e) => setConfirmPwd(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className={`btn w-100 ${styles.signInBtn}`}
                                >
                                    Sign Up
                                </button>
                            </form>
                            {/* Sign Up Link */}
                            <div className={styles.signUpLink}>
                                Already have an account?{" "}
                                <Link to="/sign-in" className={styles.signUp} href="">Sign in</Link>
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
