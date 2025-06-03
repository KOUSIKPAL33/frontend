import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import baseurl from "../Url";
import styles from "./signup.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin,faGoogle } from "@fortawesome/free-brands-svg-icons";


function Login({ onLoginSuccess, switchToSignup,switchToadminlogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
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
        toast.error("Enter valid credentials.", {
          position: "top-center",
          theme: "colored",
          autoClose: 1500,
        });
      } else {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("authToken", json.token);
        toast.success("Login Successful", {
          theme: "colored",
          position: "top-center",
          autoClose: 1500,
        })
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  const onChangeHandler = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="container">
      <h1 className={styles.heading}>Sign in</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="form-floating mb-3 mt-3">
          <input
            type="password"
            className={`${styles.bottom_border} form-control`}
            name="password"
            value={credentials.password}
            onChange={onChangeHandler}
            placeholder="password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="mb-3 d-flex justify-content-between">
         <div>
         <input type="checkbox" name="" id="" 
           className={`${styles.check}`} required/>
          <label htmlFor="">Remember me</label>
         </div>
          <div style={{color:"blue"}}>forgot password?</div>

        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Sign in</button>
        </div>
        <div className="d-flex justify-content-between mt-3 mb-3">
          <div>Not a member ? <Link className="" onClick={switchToSignup}>Register</Link></div>

          <div><Link className="ml-3" onClick={switchToadminlogin}>Admin login</Link></div>

        </div>
        <hr />
        <div>
          <div className="fs-5 text-center">sign in with </div>
          <div className="text-center mt-3">
            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faGoogle} /></Link>
            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faFacebook} /></Link>
            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faLinkedin} /></Link>
            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faTwitter} /></Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
