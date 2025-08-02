import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

function AdminHome() {
  const shop = localStorage.getItem("shop") || "defaultShop";

  return (
    <>
      <Toaster />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar shop={shop} />
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminHome;
