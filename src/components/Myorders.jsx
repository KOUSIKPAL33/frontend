import React from 'react'
import Navbar from './Navbar'
import Myorderscard from './Myorderscard'
import { useEffect, useState } from 'react';
import baseurl from '../Url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

function Myorders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'out for delivery':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };
  const handleCancelOrder = () => {
    console.log("button clicked")
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseurl}/order/get`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch orders');
        }

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);
  console.log(orders);
  return (
    <>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999 }}>
          <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: "#f1f3f6", marginTop: '5rem', width: "max-content" }} className='container'>
          <h1
            className="text-center fw-bold fs-1 text-primary"
            style={{
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              letterSpacing: "1px",
              marginBottom: "30px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
          >
            <FontAwesomeIcon icon={faReceipt} className="me-2" />  My Orders
          </h1>

          {orders.map((order, index) => (
            <div key={index} className="p-3 mb-4 border rounded bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Order #{index + 1}</h5>
                <span className={`badge bg-${getStatusColor(order.status)} text-capitalize`}>
                  {order.status}
                </span>
              </div>

              <p className="mb-1">
                <strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="mb-2"><strong>Delivery Location:</strong> {order.deliveryLocation}</p>
              <hr />
              <div className="row flex-wrap gap-3">

                {order.ordersbyshop.map((itemsbyshop, idx) => (

                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-3 fs-5">Shop Name: {itemsbyshop.shopName}</h5>
                      <span className={`badge bg-${getStatusColor(order.status)} text-capitalize`}>
                        {itemsbyshop.status}
                      </span>
                    </div>
                    
                    <div className="row flex-wrap gap-3">
                      {itemsbyshop.items.map((item, idxx) => (
                        <div key={idxx} className="col-auto">
                          <Myorderscard {...item} />
                        </div>
                      ))}
                    </div>
                    <p><strong>ShopTotal: </strong>₹{itemsbyshop.shopTotal}</p>
                    <hr />
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <p><strong>Total Price:</strong> ₹{order.totalAmount}</p>
                <span
                  className={`btn ${order.status === 'pending' ? 'btn-outline-danger' : 'btn-secondary disabled'}`}
                  style={{ pointerEvents: order.status === 'pending' ? 'auto' : 'none' }}
                  onClick={handleCancelOrder}
                >
                  {order.status === 'pending' ? 'Cancel Order' : 'Locked'}
                </span>

              </div>
            </div>
          ))}


        </div>
      )}
    </>
  )
}

export default Myorders
