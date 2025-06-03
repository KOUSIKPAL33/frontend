import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import styles from "./Navbar.module.css";
import baseurl from "../Url";
import { cartcontext } from "../contexts/Contextprovider";
import { userContext } from "../contexts/userContext";

import AdminLogin from "../admin/AdminLogin";


const Navbar = () => {
  const token = localStorage.getItem("authToken");
  const { cart, dispatch } = useContext(cartcontext)
  const { user, dispatchUser } = useContext(userContext)
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState("login");

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleModal = (formType) => {
    setActiveForm(formType);
    setShowModal((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowModal(false);
    navigate("/");
  };
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch(`${baseurl}/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch({ type: "SetCart", payload: data.cartItems });
            dispatchUser({
              type: "SET_USER",
              payload: {
                name: data.name,
                mobile: data.mobileno,
                addresses: data.addresses,
              },
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserDetails();
  }, [isLoggedIn]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-gradient p-1 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand fs-2 m-0 p-0" to="/">InCampusFood</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><Link className="nav-link active fs-5" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/yummpy">Yummpy</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/dominos">Domino's</Link></li>
              <li className="nav-item"><Link className="nav-link fs-5" to="/kathijunction">Kathijunction</Link> </li>
            </ul>

            {!token ? (
              <div className="d-flex gap-1">
              <button className="btn btn-secondary" onClick={() => toggleModal("signup")}>Sign Up</button>
              <button className="btn btn-primary" onClick={() => toggleModal("login")}>Login</button>
              <button className="btn btn-danger" onClick={() => toggleModal("adminLogin")}>Admin</button>
              </div>
            ) : (
              <div>
                <ul className="mt-2 d-flex gap-2">
                  <li className="btn btn-outline-light me-2 position-relative">
                    {user.name.split(" ")[0].trim()}
                  </li>
                  <li className="position-relative">
                    <Link className="btn btn-outline-light me-2" to="/Mycart">Cart</Link>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  </li>
                  <li className="btn btn-danger" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
              <button className={styles.close_btn} onClick={() => setShowModal(false)}>✖</button>
              {activeForm === "login" ? (
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  switchToSignup={() => setActiveForm("signup")}
                  switchToadminlogin={() => setActiveForm("adminlogin")}
                />
              ) : activeForm === "signup" ? (
                <Signup
                  switchToLogin={() => setActiveForm("login")}
                  onSignupSuccess={() => setShowModal(false)}
                />
              ) : (
                <AdminLogin
                  onAdminLoginSuccess={() => setShowModal(false)}
                  switchToLogin={() => setActiveForm("adminlogin")}

                />
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
