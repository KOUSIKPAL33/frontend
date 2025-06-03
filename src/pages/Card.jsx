import React, { useContext } from "react";
import styles from './Card.module.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { cartcontext } from "../contexts/Contextprovider";
import baseurl from "../Url";

function Card(props) {
    const { dispatch } = useContext(cartcontext)
    async function handleCart() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please! log in to add items to the cart.', {
                    position: "top-center",
                    autoClose:1500,
                });
                return;
            }
            const productDetails = {
                productId: props.pid,
                productDetails: {
                    name: props.name,
                    imgSrc: props.imgSrc,
                    price: props.price,
                }
            };

            const response = await axios.post(`${baseurl}/cart/create`,
                productDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.data.success) {
                dispatch({ type: "Add", product: props });
                toast.success("Item added to cart!",{ autoClose: 1500,position:"bottom-right" });
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
        <div>
            <ToastContainer />
            <div className={'border border-primary shadow p-3 mb-5 bg-body rounded' + styles.myzoom} style={{ width: '16.5rem' }}>
                <img src={'./' + props.imgSrc} className="card-img-top" style={{ height: '12rem' }} alt={props.name} />
                <div className="card-body">
                    <h5 className="card-title text-wrap">{props.name}</h5>
                    <p className="card-text">Some Description </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="btn btn-secondary text-center">Price: {props.price}/-</div>
                        <button
                            className={'btn btn-primary '}
                            onClick={handleCart}
                        >Add to Cart
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
