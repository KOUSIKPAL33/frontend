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
        <h2 className={styles.heading}>My Cart</h2>
        {cart.length === 0 ? (
          <p className={styles.empty}>Your Cart is empty.</p>
        ) : (
          <div>
            <table className={styles.my_table}>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Name</th>
                  <th>Image</th>
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