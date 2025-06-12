import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import Showdata from './Showdata';
import ShowOrders from './Showorders';

function AdminHome() {
  const location = useLocation();
  const shop = location.state?.shop || "default";
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Showdata shop={shop} />;
      case 'orders':
        return <ShowOrders shop={shop} />;
      default:
        return <Showdata shop={shop} />;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar shop={shop} setActiveTab={setActiveTab} activeTab={activeTab}/>
      <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminHome;
