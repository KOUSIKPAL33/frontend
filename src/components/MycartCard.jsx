import React, { useContext } from 'react';
import axios from 'axios';
import { cartcontext } from '../contexts/Contextprovider';
import toast from 'react-hot-toast';
import baseurl from '../Url';


function MycartCard({ product, slno }) {
  const { cart, dispatch } = useContext(cartcontext);

  const updateQuantity = async (productId, action) => {
    try {
      await axios.put(
        `${baseurl}/cart/updatequantity`,
        { productId, action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to update cart quantity", err);
    }
  };

  const Increase = (id) => {
    const index = cart.findIndex((p) => p.productId === id);
    if (cart[index].quantity >= 10) {
      toast.error("Maximum quantity reached", { duration: 1500 });
      return;
    }
    if (index !== -1 && cart[index].quantity < 10) {
      dispatch({ type: "Increase", id });
      updateQuantity(id, "increase");
    }
  };

  const Decrease = (id) => {
    const index = cart.findIndex((p) => p.productId === id);
    if (cart[index].quantity <= 1) {
      toast.error("Minimum quantity is 1", { duration: 1500 });
      return;
    }
    if (index !== -1 && cart[index].quantity > 1) {
      dispatch({ type: "Decrease", id });
      updateQuantity(id, "decrease");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You are not logged in", { duration: 1500 });
      return;
    }

    try {
      const response = await axios.delete(`${baseurl}/cart/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { productId: product.productId },
      });

      if (response.data.success) {
        dispatch({ type: "Remove", id: product.productId });
        toast.success("Item deleted successfully", { duration: 1500 });
      } else {
        toast.error("Failed to delete item", { duration: 1500 });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <td>{slno}.</td>
      <td>{product.name}</td>
      <td>
        <img
          src={`${baseurl.replace("/api", "")}/${product.imgSrc}`}
          alt={product.name}
          className="img-fluid rounded"
          style={{ width: "130px", height: "100px", objectFit: "cover" }}
        />
      </td>
      <td>{product.shopname}</td>
      <td>{product.option}</td>
      <td>Rs. {product.price}/-</td>
      <td>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button onClick={() => Decrease(product.productId)} className="btn fs-2" >-</button>
          <span className="fw-bold">{product.quantity}</span>
          <button onClick={() => Increase(product.productId)} className="btn fs-3" > + </button>
        </div>
      </td>
      <td>Rs. {product.quantity * product.price}/-</td>
      <td> <button className="btn btn-danger btn-sm" onClick={handleDelete}> Delete </button> </td>
    </>
  );
}

export default MycartCard;
