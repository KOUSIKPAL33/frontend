import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import baseurl from "../Url";
import styles from "./signup.module.css";

function Forgotpassword({ onForgotpasswordSuccess }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully", { autoClose: 1500 });
        setLoading(false);
        setStep(3);
      } else {
        toast.error(response.data.message || "Invalid or expired OTP", { autoClose: 1500 });
        setLoading(false);
        setStep(1);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Server error during OTP verification");
    }
  };

  const resetPasswordHandler = async (e) => {

    setLoading(true);
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be of length 8.", { position: "top-center" })
      setLoading(false);
      return;
    }
    else if (password.length > 20) {
      toast.error("Password must be of length less than 20.", { position: "top-center" })
      setLoading(false);
      return;
    }
    else if (password !== cpassword) {
      toast.error("Passwords do not match", { autoClose: 1500 });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseurl}/reset-password`, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Password reset successful", { autoClose: 1500 });
        setLoading(false);
        onForgotpasswordSuccess();
      } else {
        toast.error(response.data.message || "Failed to reset password", { autoClose: 1500 });
        setLoading(false);
        setStep(1);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
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
            {loading ? (
              <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">Send OTP</button>
            )}
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtpHandler}>
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
          <div className="d-grid">
            {loading ? <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button> :
              <button type="submit" className="btn btn-warning">Verify OTP</button>}
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPasswordHandler}>
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
            {loading ? <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button> :
              <button type="submit" className="btn btn-success">Reset Password</button>}
          </div>
        </form>
      )}
    </div>
  );
}

export default Forgotpassword;
