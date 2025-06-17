import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import baseurl from '../Url';
import Myorderscard from '../components/Myorderscard'

function Showorders({ shop }) {
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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseurl}/order/shopget/${shop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && shop) fetchOrders();
  }, [token, shop]);

  console.log("orders are ", orders)
  return (
    <div style={{ backgroundColor: "#f1f3f6", marginTop: '5rem', width: "max-content" }} className='container'>
      <h1
        className="text-center fw-bold fs-1 text-primary"
        style={{
          textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          letterSpacing: "1px",
          marginBottom: "30px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      ><FontAwesomeIcon icon={faReceipt} className="me-2" />  New Orders
      </h1>
      {orders && orders.length > 0 ? (
        orders.map((order, idx) => (
          <div key={order.orderId || idx} className="bg-white shadow-sm p-3 mb-4 rounded border">
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0"><strong>Customer:</strong> {order.user.name} ({order.user.mobile})</h5>
                <span className={`badge bg-${getStatusColor(order.shopOrder.status)} text-capitalize`}>
                  {order.shopOrder.status}
                </span>
              </div>
    
              <p className="mb-1"><strong>Delivery Location:</strong> {order.deliveryLocation}</p>
              <p className="mb-2"><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              
            </div>

            <div className="d-flex flex-wrap gap-3">
              {order.shopOrder.items.map((item, idx2) => (
                <Myorderscard key={idx2} {...item} shopName={order.shopOrder.shopName} />
              ))}
            </div>

            <div className="mt-3 d-flex justify-content-end">
              <h5>Total: ₹{order.shopOrder.shopTotal}</h5>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No new orders.</p>
      )}
    </div>
  );
}

export default Showorders
