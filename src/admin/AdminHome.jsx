import React from 'react'
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import Showdata from './Showdata';
function AdminHome() {
    const location = useLocation();
    const shop = location.state?.shop || "default";
  return (

    <div>
       <Navbar shop={shop} />
       <Showdata shop={shop}/>
    </div>
  )
}

export default AdminHome
