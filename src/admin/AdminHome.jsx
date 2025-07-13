import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';

function AdminHome() {
  const shop = localStorage.getItem("shop") || "defaultShop";

  return (
    <>
      <ToastContainer />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar shop={shop} />
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <Outlet/>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
