import React, { useContext, useState } from 'react';
import styles from './cart.module.css';
import axios from 'axios';
import { cartcontext } from '../contexts/Contextprovider';
import { toast } from 'react-toastify';
import baseurl from '../Url';

function MycartCard({ product, slno }) {

  const { cart, dispatch } = useContext(cartcontext)
  const Increase = (id) => {
    const index = cart.findIndex(p => p.productId === id);
    if (index !== -1 && cart[index].quantity < 10) {
      dispatch({ type: "Increase", id });
    }
  };

  const Decrease = (id) => {
    const index = cart.findIndex(p => p.productId === id);

    if (index !== -1 && cart[index].quantity > 1) {
      dispatch({ type: "Decrease", id });
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No token found. User might not be authenticated.");
      return;
    }
    console.log(product.productId)
    try {
      const response = await axios.delete(`${baseurl}/cart/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { productId: product.productId },
        }
      );

      if (response.data.success) {
        dispatch({ type: "Remove", id: product.productId });
        toast.success('Item deleted Successfully',{
          position:'bottom-right',
          autoClose:1500
        })
      } else {
        console.log("Failed to delete item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <td style={{ width: '70px' }}>{slno}.</td>
      <td>{product.name}</td>
      <td>
        <img
          src={'./' + product.imgSrc}
          alt={product.name}
          style={{ width: '180px', height: '140px', padding: '5px' }}
        />
      </td>
      <td>{product.option}</td>
      <td>Rs. {product.price}/-</td>
      <td>
        <div className={styles.quantity_box}>
          <button onClick={() => Decrease(product.productId)} className={styles.id_button}><b>−</b></button>
          <button className={styles.id_button}>{product.quantity}</button>
          <button onClick={() => Increase(product.productId)} className={styles.id_button}><b>+</b></button>
        </div>
      </td>
      <td>Rs. {product.quantity * product.price}/-</td>
      <td style={{ width: '70px' }}>
        <button className='btn btn-warning' onClick={handleDelete}>Delete</button>
      </td>
    </>
  );
}

export default MycartCard;
