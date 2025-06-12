import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import baseurl from "../Url";
import styles from "./signup.module.css";

function Forgotpassword() {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP & Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const sendOtpHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseurl}/send-otp`, { email });

      if (response.data.success) {
        toast.success("OTP sent to your email", { autoClose: 1500 });
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send OTP", { autoClose: 1500 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while sending OTP");
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords do not match", { autoClose: 1500 });
      return;
    }

    try {
      const response = await axios.post(`${baseurl}/verify-otp-reset`, {
        email,otp,password,
      });

      if (response.data.success) {
        toast.success("Password reset successful", { autoClose: 1500 });
        setStep(1); 
      } else {
        toast.error(response.data.message || "Failed to reset password", { autoClose: 1500 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during password reset");
    }
  };

  return (
    <div className="container">
      <h1 className={styles.heading}>Forgot Password</h1>
      {step === 1 && (
        <form onSubmit={sendOtpHandler}>
          <div className="form-floating mb-3 mt-3">
            <input
              type="email"
              className={`${styles.bottom_border} form-control`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Send OTP</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPasswordHandler}>
          <div className="form-floating mb-3 mt-3">
            <input
              type="text"
              className={`${styles.bottom_border} form-control`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <label>Enter OTP</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              type="password"
              className={`${styles.bottom_border} form-control`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <label>New Password</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              type="password"
              className={`${styles.bottom_border} form-control`}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <label>Confirm Password</label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success">Reset Password</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Forgotpassword;
