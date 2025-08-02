import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faEdit } from "@fortawesome/free-solid-svg-icons";
import baseurl from '../Url';
import Myorderscard from '../components/Myorderscard'
import toast  from 'react-hot-toast';

function Showorders({ shop }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

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

  const updateOrderStatus = async (orderId, shopName, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.put(`${baseurl}/order/update`, {
        orderId,
        shopName,
        newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message) {
        toast.success('Order status updated!');
        const updatedResponse = await axios.get(`${baseurl}/order/shopget/${shop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setOrders(updatedResponse.data);
        setFilteredOrders(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.error || 'Failed to update order status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.shopOrder.status === statusFilter));
    }
  }, [orders, statusFilter]);

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
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && shop) fetchOrders();
  }, [token, shop]);
  return (
    <div style={{ backgroundColor: "#f1f3f6", marginTop: '5rem' }} className='container'>
      <h1
        className="text-center fw-bold fs-1 text-primary"
        style={{
          textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          letterSpacing: "1px",
          marginBottom: "30px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      ><FontAwesomeIcon icon={faReceipt} className="me-2" />Orders
      </h1>

      {/* Status Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="d-flex justify-content-center">
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        filteredOrders
          .map((order, idx) => (
            <div key={order.orderId || idx} className="bg-white shadow-sm p-3 mb-4 rounded border">
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0"><strong>Customer:</strong> {order.user.name} ({order.user.mobile})</h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge bg-${getStatusColor(order.shopOrder.status)} text-capitalize`}>
                      {order.shopOrder.status}
                    </span>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        disabled={updatingStatus[order.orderId]}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Change Status
                      </button>
                      <ul className="dropdown-menu">
                        <li><button
                          className="dropdown-item"
                          onClick={() => updateOrderStatus(order.orderId, order.shopOrder.shopName, 'pending')}
                          disabled={order.shopOrder.status === 'pending'}
                        >
                          Pending
                        </button></li>
                        <li><button
                          className="dropdown-item"
                          onClick={() => updateOrderStatus(order.orderId, order.shopOrder.shopName, 'preparing')}
                          disabled={order.shopOrder.status === 'preparing'}
                        >
                          Preparing
                        </button></li>
                        <li><button
                          className="dropdown-item"
                          onClick={() => updateOrderStatus(order.orderId, order.shopOrder.shopName, 'out for delivery')}
                          disabled={order.shopOrder.status === 'out for delivery'}
                        >
                          Out for Delivery
                        </button></li>
                        <li><button
                          className="dropdown-item"
                          onClick={() => updateOrderStatus(order.orderId, order.shopOrder.shopName, 'delivered')}
                          disabled={order.shopOrder.status === 'delivered'}
                        >
                          Delivered
                        </button></li>
                      </ul>
                    </div>
                    {updatingStatus[order.orderId] && (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p><strong>Delivery Location: Name: </strong> {order.deliveryLocation.name}</p>
                  <p><strong>Mobile: </strong>{order.deliveryLocation.mobileno} </p>
                  <p><strong>Address: </strong>{order.deliveryLocation.location}</p>
                </div>
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
        <p className="text-center text-muted">
          {statusFilter === 'all' ? 'No orders found.' : `No ${statusFilter} orders found.`}
        </p>
      )}

    </div>
  );
}

export default Showorders
