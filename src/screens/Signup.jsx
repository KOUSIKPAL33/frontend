import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import styles from "./signup.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import baseurl from '../Url';

function Signup({ onLoginSuccess, onSignupSuccess, switchToLogin }) {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", cpassword: "", mobileno: "" })
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [emailForOtp, setEmailForOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [resending, setResending] = useState(false);
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (credentials.name.trim().length == 0) {
            toast.error("Name cannot be left blank. ", { position: "top-center" });
            setLoading(false);
            return;
        }
        else if (credentials.password !== credentials.cpassword) {
            toast.error("Password is not matched", { position: "top-center" });
            setLoading(false);
            return;
        } else if (credentials.password.length < 8) {
            toast.error("Password must be of length 8.", { position: "top-center" })
            setLoading(false);
            return;
        }
        else if (credentials.password.length > 20) {
            toast.error("Password must be of length less than 20.", { position: "top-center" })
            setLoading(false);
            return;
        } else if (!/^[6-9]\d{9}$/.test(credentials.mobileno)) {
            toast.error("Enter a valid 10-digit mobile number.", { position: "top-center" })
            setLoading(false);
            return;
        }
        try {
            // Check if email already exists
            setLoading(true);
            const res = await fetch(`${baseurl}/checkmail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: credentials.email }),
            });
            const data = await res.json();
            if (data.exists) {
                toast.error("Email already exists.", { position: "top-center" });
                setLoading(false);
                return;
            } else {
                const otpRes = await fetch(`${baseurl}/sendotp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: credentials.email }),
                });
                const otpData = await otpRes.json();
                if (otpData.success) {
                    setEmailForOtp(credentials.email);
                    setStep(2);
                } else {
                    toast.error("Failed to send OTP. Try again.", { position: "top-center" });
                }
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error checking email.", { position: "top-center" });
            setLoading(false);
        }
    };
    // OTP verification and registration
    const handleOtpSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            // Verify OTP
            const otpRes = await fetch(`${baseurl}/verifyotp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailForOtp, otp }),
            });
            const otpData = await otpRes.json();
            if (!otpData.success) {
                toast.error("Invalid OTP", { position: "top-center" });
                setLoading(false);
                return;
            }

            // OTP verified, now register user
            const regRes = await fetch(`${baseurl}/createuser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    mobileno: credentials.mobileno,
                }),
            });
            const regData = await regRes.json();
            if (regData.success) {
                toast.success("Registration Successful", { position: "top-center" });
                setOtp("");
                setStep(1);
                navigate("/");
                onSignupSuccess();
                setLoading(false);
                handleLogin();
                setcredentials({ name: "", email: "", password: "", cpassword: "", mobileno: "" });
                return;
            } else {
                toast.error("Registration failed.", { position: "top-center" });
                setLoading(false);
                return;
            }
        } catch (error) {
            toast.error("Error verifying OTP or registering.", { position: "top-center" });
            setLoading(false);
        }
    };
    const handleResendOtp = async () => {
        if (!emailForOtp) {
            toast.error("No email to send OTP.", { position: "top-center" });
            return;
        }
        setResending(true);
        try {
            const otpRes = await fetch(`${baseurl}/sendotp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailForOtp }),
            });
            const otpData = await otpRes.json();
            if (otpData.success) {
                toast.success("OTP resent to your email.", { position: "top-center", autoClose: 2000 });
            } else {
                toast.error("Failed to resend OTP. Try again.", { position: "top-center", autoClose: 2000 });
            }
        } catch (error) {
            toast.error("Error resending OTP.", { position: "top-center", autoClose: 2000 });
        }
        setResending(false);
    };
    const onChangeHandler = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value })

    }
    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseurl}/loginuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const responseText = await response.text();
            const json = responseText ? JSON.parse(responseText) : {};
            if (!json.success) {
                toast.error("Enter valid credentials.", { position: "top-center", theme: "colored", autoClose: 1500, });
                setLoading(false);
            } else {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("authToken", json.token);
                onLoginSuccess();
                setLoading(false);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("An error occurred while submitting the form.");
        }
    };
    return (
        <>  {step === 1 && (<div className='container'>
            <h1 className={styles.heading}>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-floating ">
                    <input type="text" className={`${styles.bottom_border} form-control`}
                        name='name' value={credentials.name} onChange={onChangeHandler}
                        placeholder='Name' required />
                    <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating  ">
                    <input type="email" className={`${styles.bottom_border} form-control`}
                        name='email' value={credentials.email} onChange={onChangeHandler}
                        placeholder='Email Address' required />
                    <label htmlFor="exampleInputEmail1" >Email Address</label>

                </div>
                <div className="form-floating  ">
                    <input type={showPassword ? "text" : "password"}
                        className={`${styles.bottom_border} form-control`}
                        name='password' value={credentials.password} onChange={onChangeHandler}
                        placeholder='Password' required />
                    <label htmlFor="exampleInputPassword1" >Password</label>
                    <span
                        style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                <div className="form-floating  " style={{ position: "relative" }}>
                    <input
                        type={showCPassword ? "text" : "password"}
                        className={`${styles.bottom_border} form-control`}
                        name='cpassword'
                        value={credentials.cpassword}
                        onChange={onChangeHandler}
                        placeholder='Confirm Password'
                        required
                    />
                    <label htmlFor="exampleInputPassword1" >Confirm Password</label>
                    <span
                        style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
                        onClick={() => setShowCPassword((prev) => !prev)}
                    >
                        <FontAwesomeIcon icon={showCPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                <div className="form-floating  ">
                    <input type="number" className={`${styles.mobile} ${styles.bottom_border} form-control`}
                        name='mobileno' value={credentials.mobileno} onChange={onChangeHandler}
                        placeholder='Mobile No' required />
                    <label htmlFor="mobile">Mobile No.</label>
                </div>
                <div className="m-3">
                    <input type="checkbox" className={`${styles.check}`} required />
                    <label htmlFor="">I've read the terms & conditions</label>
                </div>
                <div className="d-grid">
                    {loading ? <button className="btn btn-primary" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button> : <button type="submit" className="btn btn-primary">Sign Up</button>}
                </div>

                <div className="mt-3 mb-3">
                    Already a user ?<Link className="m-3" onClick={switchToLogin}>Log in</Link>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <div className="fs-5 text-center">sign up with </div>
                    <div className="text-center">
                        <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faGoogle} /></Link>
                        <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faFacebook} /></Link>
                        <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faLinkedin} /></Link>
                        <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faTwitter} /></Link>
                    </div>
                </div>
            </form >
        </div >)
        }

            {
                step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="form-floating">
                            <input
                                type="text"
                                className={`${styles.bottom_border} form-control mt-5`}
                                name="otp"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                            />
                            <label htmlFor="otp">Enter OTP sent to your email</label>
                        </div>
                        <div className="d-grid mt-3">
                            {loading ? <button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button> : <button type="submit" className="btn btn-primary">Verify Otp</button>}
                        </div>
                        <div className="d-grid mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <div className="d-grid mt-3">
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={handleResendOtp}
                                    disabled={resending || loading}
                                >
                                    {resending ? "Resending OTP..." : "Resend OTP"}
                                </button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>

    )
}

export default Signup
