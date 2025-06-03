import React from 'react'
import { Link,useNavigate } from "react-router-dom";


function Navbar({shop}) {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
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
          <li className="nav-item text-white fs-3">{shop.charAt(0).toUpperCase() + shop.slice(1)} Admin Pannel</li>
        </ul>
        {token ? (
        <div className="d-flex gap-1">
           <li className="btn btn-danger" onClick={handleLogout}>Logout</li>

        </div>
      ) : (
        <div>
          not token
        </div>
      )}
        </div>
      
      </div>
    </nav>
  )
}

export default Navbar
