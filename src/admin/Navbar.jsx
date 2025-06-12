import React from 'react'
import { Link, useNavigate } from "react-router-dom";


function Navbar({ shop,setActiveTab,activeTab}) {
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
            <li className={`nav-item nav-link fs-5 ${activeTab === 'products' ? 'active' : ''}`} style={{cursor:"pointer"}} onClick={() => setActiveTab('products')}>Show Products</li>
            <li className={`nav-item nav-link fs-5 ${activeTab === 'orders' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('orders')}>New Orders</li>
          </ul>
          {token ? (
            <div className="d-flex gap-1">
              <li className="btn btn-light">{shop}</li>
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
