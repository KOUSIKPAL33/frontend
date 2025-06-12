import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { cartcontext } from '../contexts/Contextprovider';
import baseurl from '../Url';

function CardDominos(props) {
  const {dispatch}=useContext(cartcontext)
  const [price, setPrice] = useState(props.options.Regular);
  const [choiceoptions, setOptions] = useState("Regular")

  const handlePriceChange = (event) => {
    const size = event.target.value;
    if (size == "Regular") {
      setPrice(props.options.Regular);
      setOptions("Regular")
    }
    else if (size == "Medium") {
      setPrice(props.options.Medium);
      setOptions("Medium")

    }
    else if (size == "Large") {
      setPrice(props.options.Large);
      setOptions("Large")
    }
  }

  async function handleCart() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You must be logged in to add items to the cart.', {
          position: "bottom-right",
          autoClose:1500,
        });
        return;
      }
      const productDetails = {
        productId: props.pid,
        productDetails: {
          shopname:props.shopname,
          name: props.name,
          imgSrc: props.imgSrc,
          option: choiceoptions,
          price: price,
        }
      };

      const response = await axios.post(`${baseurl}/cart/create`, productDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      );
      if (response.data.success) {
        dispatch({ type: "Add", product: props });
        toast.success("Item added to cart!", { autoClose: 1500, position: "bottom-right" });
      }

    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === "Item already in cart") {
        toast.info('Item is already in the cart.');
      } else {
        console.error("Error adding to cart:", error);
        toast.error('Something went wrong. Please try again.');
      }
    }
  }


  return (
    <>
      <div style={{ width: '19rem' }} className='border border-primary shadow p-3 mb-5 bg-body rounded'>
        <img src={props.imgSrc} className="card-img-top" style={{ height: '10rem', }} alt="kousik" />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
          <p className="card-text">Some quick example text.</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <select name="" onChange={handlePriceChange} className='btn btn-light'>

                <option value="Regular">Regular</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <button className="btn btn-secondary fs-6">Rs.{price}/-</button>
            <button className="btn btn-primary fs-6 p-1" onClick={handleCart}>Add Cart</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardDominos
