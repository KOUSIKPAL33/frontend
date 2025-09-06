import React, { use, useState } from "react";
import { toast } from "react-hot-toast";
import { Link,useNavigate } from "react-router-dom";
import baseurl from "../Url";
import styles from "./signup.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../components/firebase';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();


function Login({ onLoginSuccess, switchToSignup, switchToadminlogin, switchToForgotpassord }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
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
        toast.success("Login Successful", { theme: "colored", position: "top-center", autoClose: 1500, })
        onLoginSuccess();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };
  const authWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Step 1: Check if user already exists
      const res = await fetch(`${baseurl}/checkmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (data.exists) {
        // ✅ Existing user → log them in
        const response = await fetch(`${baseurl}/loginuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            password: "",
          }),
        });
        const json = await response.json();
        if (!json.success) {
          toast.error("Login Failed!", { position: "top-center" });
        } else {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("authToken", json.token);
          onLoginSuccess();
          navigate("/");
        }
      } else {
        // ✅ New Google user → create account in backend
        const regRes = await fetch(`${baseurl}/createuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName || "Google User",
            email: user.email,
            password: "",   // save dummy password
            mobileno: "",
          }),
        });
        const regData = await regRes.json();

        if (regData.success) {
          // ✅ Now call login API immediately
          const response = await fetch(`${baseurl}/loginuser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              password: "",
            }),
          });
          const json = await response.json();
          if (json.success) {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("authToken", json.token);
            onSignupSuccess();
            onLoginSuccess();
            toast.success("Signed up with Google!", { position: "top-center" });
            navigate("/");
          } else {
            toast.error("Google signup succeeded but login failed.", { position: "top-center" });
          }
        } else {
          toast.error("Google signup failed.", { position: "top-center" });
        }
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      toast.error("Google authentication failed. Please try again.", { position: "top-center" });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className={styles.heading}>Welcome Back</h1>
      <form onSubmit={handleLogin}>
        <div className="form-floating mb-3 mt-3" >
          <input
            type="email"
            className={`${styles.bottom_border} form-control`}
            name="email"
            value={credentials.email}
            onChange={onChangeHandler}
            placeholder="Email address"
            required
          />
          <label htmlFor="email"> Email address</label>
        </div>
        <div className="form-floating  mb-3 mt-3">
          <input
            type={showPassword ? "text" : "password"}
            className={`${styles.bottom_border} form-control`}
            name='password'
            value={credentials.password}
            onChange={onChangeHandler}
            placeholder='Password'
            required
          />
          <label htmlFor="exampleInputPassword1" >Password</label>
          <span
            style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <div>
            <input type="checkbox" name="" id=""
              className={`${styles.check}`} />
            <label htmlFor="">Remember me</label>
          </div>
          <p style={{ color: "blue", cursor: "pointer" }} onClick={switchToForgotpassord}>forgot password?</p>

        </div>
        <div className="d-grid">
          {loading ? <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button> : <button type="submit" className="btn btn-primary">Sign in</button>}
        </div>
      </form>
      <div className="d-flex justify-content-between mt-3 mb-3">
        <div>Not a member ? <Link className="" onClick={switchToSignup}>Register</Link></div>

        <div><Link className="ml-3" onClick={switchToadminlogin}>Admin login</Link></div>

      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <div className="fs-5 text-center">sign in with </div>
        <div className="text-center">
          <button className="btn btn-primary btn-floating m-1" onClick={authWithGoogle} > <FontAwesomeIcon icon={faGoogle} /></button>
          <button className="btn btn-primary btn-floating m-1"> <FontAwesomeIcon icon={faFacebook} /></button>
          <button className="btn btn-primary btn-floating m-1"> <FontAwesomeIcon icon={faLinkedin} /></button>
          <button className="btn btn-primary btn-floating m-1"> <FontAwesomeIcon icon={faTwitter} /></button>
        </div>
      </div>
    </div>
  );
}

export default Login;
