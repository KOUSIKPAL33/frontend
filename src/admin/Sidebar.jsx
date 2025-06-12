import React from 'react';
import './sidebar.css';

function Sidebar({ shop, setActiveTab, activeTab }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={shop.logo} alt="Shop Logo" className="shop-logo" />
        <h4 className="shop-name">{shop.name}</h4>
      </div>

      <ul className="sidebar-links">
        <li
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Show Products
        </li>
        <li
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add New Product
        </li>
        <li
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
          style={{ position: 'relative' }}
        >
          New Orders
          {shop.newOrders > 0 && (
            <span className="badge">{shop.newOrders}</span>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
