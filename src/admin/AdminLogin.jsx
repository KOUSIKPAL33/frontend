import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import baseurl from "../Url";
import styles from "../screens/signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";


function AdminLogin({ onAdminLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: "", password: "", shop: "" });
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!credentials.shop || credentials.shop === "default") {
      toast.error("Please select a shop", {
        theme: "colored",
        position: "top-center",
        autoClose: 1500,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseurl}/loginadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          shop: credentials.shop,
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
        setLoading(false);
      } else {
        localStorage.setItem("authToken", json.token);
        toast.success("Login Successful", {
          theme: "colored",
          position: "top-center",
          autoClose: 1500,
        });
        onAdminLoginSuccess();
        navigate("./admin",{
          state:{shop:credentials.shop}
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred while submitting the form.");
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="container">
      <h1 className={styles.heading}>Admin Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3 mt-3">
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
            placeholder="Password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            name="shop"
            value={credentials.shop}
            onChange={onChangeHandler}
            required
          >
            <option value="default">Select your shop</option>
            <option value="yummpy">Yummpy</option>
            <option value="Dominos">Domino's</option>
            <option value="Kathijunction">Kathijunction</option>
          </select>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <div>
            <input type="checkbox" className={styles.check} required />
            <label htmlFor="">Remember me</label>
          </div>
          <div style={{ color: "blue" }}>forgot password?</div>
        </div>

        <div className="d-grid">
          {loading ? (<button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>) :(
          <button type="submit" className="btn btn-primary">Sign in</button>
          )}
        </div>

        <hr />
        <div>
          <div className="fs-5 text-center">sign in with</div>
          <div className="text-center mt-3">
            <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faGoogle} /></Link>
            <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faFacebook} /></Link>
            <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faLinkedin} /></Link>
            <Link className="btn btn-primary btn-floating m-1" to="#!" role="button"> <FontAwesomeIcon icon={faTwitter} /></Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
