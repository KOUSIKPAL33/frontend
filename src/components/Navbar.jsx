import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Forgotpassword from "../screens/Forgotpassword";
import styles from "./Navbar.module.css";
import baseurl from "../Url";
import { cartcontext } from "../contexts/Contextprovider";
import { userContext } from "../contexts/userContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOut, faReceipt } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import AdminLogin from "../admin/AdminLogin";
import toast  from "react-hot-toast";
import { handleLogout } from './handleLogout';


const Navbar = () => {

  const { cart, dispatch } = useContext(cartcontext)
  const { user, dispatchUser } = useContext(userContext)
  const [showProfile, setShowProfile] = useState(false);
  const [activelink, setActivelink] = useState("");
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem("isLoggedIn")) || false);
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState("login");
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout({ navigate, setIsLoggedIn });
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
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${baseurl}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          localStorage.setItem("isLoggedIn", false);
          setIsLoggedIn(false);
          toast.error("Session expired. Please log in again.");
          navigate("/");
          return;
        }
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SetCart", payload: data.cartItems });
          dispatchUser({
            type: "SET_USER",
            payload: {
              name: data.name,
              mobile: data.mobileno,
              email: data.email,
              addresses: data.addresses,
              profileImage: data.profileImage,
            },
          });
        } else {
          setIsLoggedIn(false);
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    };
    if (isLoggedIn) {
      fetchUserDetails();

    }
  }, [isLoggedIn]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click was outside the profile dropdown or button
      if (!e.target.closest(".profile-toggle")) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Map pathnames to your link keys
    if (location.pathname === "/") setActivelink("home");
    else if (location.pathname === "/yummpy") setActivelink("yummpy");
    else if (location.pathname === "/dominos") setActivelink("dominos");
    else if (location.pathname === "/kathijunction") setActivelink("kathijunction");
    else if (location.pathname === "/contact") setActivelink("contact");
  }, [location.pathname]);



  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-gradient p-0 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand m-0 p-0" to="/">
            <img
              src={logo}
              alt="Incampusfood Logo"
              style={{ height: "50px", width: "140px", objectFit: "cover" }}
            /> </Link>
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
              <li className="nav-item">
                <Link className={`nav-link mylink fs-5 ${activelink === "home" ? "active" : ""}`} to="/" onClick={() => setActivelink("home")}
                >Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link mylink fs-5 ${activelink === "yummpy" ? "active" : ""}`} to="/yummpy" onClick={() => setActivelink("yummpy")}
                >Yummpy </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link mylink fs-5 ${activelink === "dominos" ? "active" : ""}`}
                  to="/dominos"
                  onClick={() => setActivelink("dominos")}
                >
                  Domino's
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link mylink fs-5 ${activelink === "kathijunction" ? "active" : ""}`}
                  to="/kathijunction"
                  onClick={() => setActivelink("kathijunction")}
                >
                  Kathijunction
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link mylink fs-5 ${activelink === "contact" ? "active" : ""}`}
                  to="/contact"
                  onClick={() => setActivelink("contact")}
                >
                  Contact us
                </Link>
              </li>
            </ul>

            {isLoggedIn ? (
              <div>
                <ul className="mt-2 d-flex gap-4">
                  <li className="position-relative nav">
                    <Link className="fs-4 rounded-circle btn btn-outline-light p-0 d-flex align-items-center justify-content-center" to="/Mycart">🛒</Link>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  </li>
                  <li className="position-relative profile-toggle nav">
                    <button
                      className="btn btn-outline-light me-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", padding: 0 }}
                      onClick={() => setShowProfile(!showProfile)}
                    >
                      {/* {user.name && user.name[0] ? user.name[0].toUpperCase() : ""} */}
                      {user.profileImage ? (
                        <img
                          src={`${baseurl.replace('/api', '')}${user.profileImage}`}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}>
                          {user.name && user.name[0] ? user.name[0].toUpperCase() : ""}
                        </span>
                      )}
                    </button>


                    {showProfile && (
                      <div
                        className="position-absolute top-100 end-0 bg-white border rounded shadow-sm text-dark mt-3"
                        style={{ minWidth: "180px", zIndex: 10 }}
                      >
                        <Link className="btn btn-light w-100" to="/profile"><FontAwesomeIcon icon={faUser} className="me-2" /> My Profile</Link>
                        <Link className="btn btn-light w-100" to="/Myorders"><FontAwesomeIcon icon={faReceipt} className="me-2" /> My Orders</Link>
                        <Link className="btn btn-light w-100" onClick={handleLogoutClick}><FontAwesomeIcon icon={faSignOut} className="me-2" /> Logout</Link>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-1">
                <button className="btn btn-secondary" onClick={() => toggleModal("signup")}>Sign Up</button>
                <button className="btn btn-primary" onClick={() => toggleModal("login")}>Login</button>
                <button className="btn btn-danger" onClick={() => toggleModal("adminLogin")}>Admin</button>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {true && (
          <div className={`${styles.modal_overlay} ${showModal ? styles.show : ''}`}>
            <div className={styles.modal_content}>
              <button className={styles.close_btn} onClick={() => setShowModal(false)}>✖</button>
              {activeForm === "login" ? (
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  switchToSignup={() => setActiveForm("signup")}
                  switchToadminlogin={() => setActiveForm("adminlogin")}
                  switchToForgotpassord={() => setActiveForm("forgotpassword")}
                />
              ) : activeForm === "signup" ? (
                <Signup
                  onLoginSuccess={handleLoginSuccess}
                  switchToLogin={() => setActiveForm("login")}
                  onSignupSuccess={() => setShowModal(false)}
                />
              ) : activeForm === "forgotpassword" ? (
                <Forgotpassword
                  switchToLogin={() => setActiveForm("login")}
                  onForgotpasswordSuccess={() => setShowModal(false)}
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
