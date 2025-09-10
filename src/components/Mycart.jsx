import React, { useContext, useState } from 'react';
import Navbar from './Navbar';
import MycartCard from './MycartCard';
import { Link } from 'react-router-dom';
import { cartcontext } from '../contexts/Contextprovider';
import { totalPrice } from '../contexts/Cartreducer';

function Mycart() {
  const { cart } = useContext(cartcontext);
  const [sortConfig, setSortConfig] = useState({ field: null, order: "asc" });

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
  };

  const sortedCart = [...cart].sort((a, b) => {
    if (!sortConfig.field) return 0;
    let valA, valB;

    if (sortConfig.field === "totalPrice") {
      valA = a.price * a.quantity;
      valB = b.price * b.quantity;
    } else {
      valA = a[sortConfig.field];
      valB = b[sortConfig.field];
    }

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortConfig.order === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.order === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortArrow = (field) => {
    if (sortConfig.field !== field) return "";
    return sortConfig.order === "asc" ? " ↑" : " ↓";
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "7rem" }}>
        <h1 className="text-center fw-bold fs-1 text-primary mb-4">
          🛒 My Cart
        </h1>

        {cart.length === 0 ? (
          <p className="fs-3 text-center">Your Cart is empty.</p>
        ) : (
          <div className="table-responsive shadow rounded">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary text-center">
                <tr>
                  <th>Sl.No</th>
                  <th role="button" onClick={() => handleSort("name")} >
                    Name {renderSortArrow("name")}
                  </th>
                  <th>Image</th>
                  <th role="button" onClick={() => handleSort("shopname")} >
                    Shop {renderSortArrow("shopname")}
                  </th>
                  <th>Options</th>
                  <th role="button" onClick={() => handleSort("price")} >
                    Price {renderSortArrow("price")}
                  </th>
                  <th role="button" onClick={() => handleSort("quantity")} >
                    Qty {renderSortArrow("quantity")}
                  </th>
                  <th role="button" onClick={() => handleSort("totalPrice")}
                  >
                    Total {renderSortArrow("totalPrice")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {sortedCart.map((data, index) => (
                  <tr key={data._id} className="cart-row">
                    <MycartCard product={data} slno={index + 1} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded shadow-sm">
              <h4 className="m-0">
                Grand Total: <span className="text-success">Rs. {totalPrice(cart)}/-</span>
              </h4>
              <Link to="/Checkout" className="btn btn-primary btn-lg">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Mycart;
