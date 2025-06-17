import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Forgotpassword from "../screens/Forgotpassword";
import styles from "./Navbar.module.css";
import baseurl from "../Url";
import { cartcontext } from "../contexts/Contextprovider";
import { userContext } from "../contexts/userContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faSignOut, faReceipt, faL } from "@fortawesome/free-solid-svg-icons";
import AdminLogin from "../admin/AdminLogin";


const Navbar = () => {
  
  const { cart, dispatch } = useContext(cartcontext)
  const { user, dispatchUser } = useContext(userContext)
  const [showProfile, setShowProfile] = useState(false);

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

            {isLoggedIn ? (
              <div>
                <ul className="mt-2 d-flex gap-2">
                  <li className="position-relative">
                    <Link className="btn btn-outline-light me-2" to="/Mycart">🛒Cart</Link>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  </li>
                  <li className="position-relative profile-toggle">
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={() => setShowProfile(!showProfile)}
                    >
                      {user.name.split(" ")[0].trim()}
                    </button>

                    {showProfile && (
                      <div
                        className="position-absolute top-100 end-0 bg-white border rounded shadow-sm text-dark mt-3"
                        style={{ minWidth: "180px", zIndex: 10 }}
                      >
                        <Link className="btn btn-light w-100" to="  "><FontAwesomeIcon icon={faUser} className="me-2" /> My Profile</Link>
                        <Link className="btn btn-light w-100" to="/Myorders"><FontAwesomeIcon icon={faReceipt} className="me-2" /> My Orders</Link>
                        <Link className="btn btn-light w-100" onClick={handleLogout}><FontAwesomeIcon icon={faSignOut} className="me-2" /> Logout</Link>
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
        {showModal && (
          <div className={styles.modal_overlay}>
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
                  switchToLogin={() => setActiveForm("login")}
                  onSignupSuccess={() => setShowModal(false)}
                />
              ): activeForm === "forgotpassword" ? (
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
