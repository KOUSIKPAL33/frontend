import React, {useContext } from 'react';
import Navbar from './Navbar';
import MycartCard from './MycartCard';
import styles from './cart.module.css';
import { Link } from 'react-router-dom';
import { cartcontext } from '../contexts/Contextprovider';
import { totalPrice } from '../contexts/Cartreducer';

function Mycart() {
  const { cart } = useContext(cartcontext)

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '7rem' }}>
        <h1
          className="text-center fw-bold fs-1 text-primary"
          style={{
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            letterSpacing: "1px",
            marginBottom: "30px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        >
          🛒 My Cart
        </h1>
        {cart.length === 0 ? (
          <p className="fs-2 text-center">Your Cart is empty.</p>
        ) : (
          <div>
            <table className={styles.my_table}>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Shop Name</th>
                  <th>Options</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((data, index) => (
                  <tr key={data._id}>
                    <MycartCard
                      product={data}
                      slno={index + 1}
                    />
                  </tr>
                ))}
              </tbody>

            </table>
            <div className={styles.table_bottom}>
              <h3 className={styles.bottom_btn}>Grand Total: Rs. {totalPrice(cart)}/-</h3>
              <Link className={styles.bottom_btn} to={"/Checkout"}>Proceed to checkout</Link>
            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Mycart;