import React, { useContext } from "react";
import styles from './Card.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { cartcontext } from "../contexts/Contextprovider";
import baseurl from "../Url";

function Card(props) {
    const { dispatch } = useContext(cartcontext);

    const randomRating = (Math.random() * (4.7 - 3.5) + 3.5).toFixed(1);

    const renderStars = (rating) => {
        const fullStar = "★"; // U+2605
        const emptyStar = "☆"; // U+2606
        const filledStars = Math.floor(rating); // Get the number of full stars
        const hasHalfStar = rating - filledStars >= 0.5; // Check for a half star
        const stars = [];

        // Render full stars
        for (let i = 0; i < filledStars; i++) {
            stars.push(<span key={i} style={{ color: 'gold' }}>{fullStar}</span>);
        }

        // Render half star if applicable
        if (hasHalfStar) {
            stars.push(<span key="half" style={{ color: 'gold' }}>{fullStar}</span>);
        }

        // Render empty stars
        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<span key={`empty-${i}`} style={{ color: 'gray' }}>{emptyStar}</span>);
        }
        
        return stars;
    };

    async function handleCart() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please! log in to add items to the cart.', {
                    position: "top-center",
                    duration: 1500,
                });
                return;
            }
            const productDetails = {
                productId: props.pid,
                productDetails: {
                    shopname: props.shopname,
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
                toast.success("Item added to cart!", { duration: 1500 });
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === "Item already in cart") {
                toast.info('Item is already in the cart.', { duration: 1500 });
            } else {
                console.error("Error adding to cart:", error);
                toast.error('Something went wrong. Please try again.', { duration: 1500 });
            }
        }
    }

    return (
        <div>
            <div className={'border border-primary shadow p-3 mb-5 bg-body rounded' + styles.myzoom} style={{ width: '16.5rem' }}>
                <img src={`${baseurl.replace('/api', '')}/${props.imgSrc}`} className="card-img-top" style={{ height: '12rem' }} alt={props.name} />
                <div className="card-body">
                    <h5 className="card-title text-wrap">{props.name}</h5>
                    <p className="card-text"> <strong>Rating:</strong> {renderStars(randomRating)} ({randomRating}/5)</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="btn btn-light text-center">Price: {props.price}/-</div>
                        {props.available ?
                            (<button className={'btn btn-primary'} onClick={handleCart} style={{ cursor: "default" }}>Add to Cart</button>)
                            : (<button type="button" className="btn btn-warning " style={{ cursor: "not-allowed" }}>Not Available</button>)}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;