import React, { useState, useContext } from "react";
import styles from '../pages/Card.module.css';
import stylesoverlay from "../components/Navbar.module.css";
import stylesform from "../screens/signup.module.css"

import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import baseurl from "../Url";

function Card(props) {
    const [showModal, setShowModal] = useState(false);
    const [updatedName, setUpdatedName] = useState(props.name);
    const [updatedPrice, setUpdatedPrice] = useState(props.price);
    const [isAvailable, setIsAvailable] = useState(props.available);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(updatedName, updatedPrice, isAvailable, props.shopname);
        try {
            const response = await axios.put(`${baseurl}/update/${props.pid}`, {
                name: updatedName,
                price: updatedPrice,
                available: isAvailable,
                shop_name: props.shopname,
            });

            toast.success("Product updated successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            handleUpdateSuccess();
        } catch (error) {
            toast.error("Failed to update product");
            console.error("Update error:", error);
        }
    };

    const toggleModal = () => {
        setShowModal((prev) => !prev);
    };
    const handleUpdateSuccess = () => {
        setShowModal(false);
        
    };
    const handleDeleteProduct = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await axios.delete(`${baseurl}/delete/${props.pid}`, {
                    data: { shop_name: props.shopname }
                });

                toast.success("Product deleted successfully!");
                // Optionally, you can trigger a reload or inform the parent to remove this card
            } catch (error) {
                toast.error("Failed to delete product");
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <>
            <div>
                <ToastContainer />
                <div className={'border border-primary shadow p-3 mb-5 bg-body rounded' + styles.myzoom} style={{ width: '16.5rem' }}>
                    <img src={'./' + props.imgSrc} className="card-img-top" style={{ height: '12rem' }} alt={props.name} />
                    <div className="card-body">
                        <h5 className="card-title text-wrap">{props.name}</h5>
                        <p className="card-text m-0">Some Description </p>
                        <p className="card-text"><strong>Availble : </strong>{props.available?("Yes"):("No")}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="btn btn-secondary text-center">₹ {props.price}/-</div>
                            <button
                                className={'btn btn-primary '}
                                onClick={() => toggleModal()}
                            >Update
                            </button>
                            <button
                                className='btn btn-danger'
                                onClick={handleDeleteProduct}
                            >Delete
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={stylesoverlay.modal_overlay}>
                    <div className={stylesoverlay.modal_content}>
                        <button className={stylesoverlay.close_btn} onClick={() => setShowModal(false)}>✖</button>
                        <div className="container">
                            <h1 className={stylesform.heading}>Update Product</h1>
                            <form onSubmit={handleSubmit} className="container mt-4">
                                <div className="mb-3">
                                    <label htmlFor="itemName" className="form-label">Item Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="itemName"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="itemPrice" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className={`${stylesform.mobile} form-control`}
                                        id="itemPrice"
                                        value={updatedPrice}
                                        onChange={(e) => setUpdatedPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Availability</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="available"
                                                name="availability"
                                                value="available"
                                                checked={isAvailable === true}
                                                onChange={() => setIsAvailable(true)}
                                            />
                                            <label className="form-check-label" htmlFor="available">Available</label>
                                        </div>

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="notAvailable"
                                                name="availability"
                                                value="notAvailable"
                                                checked={isAvailable === false}
                                                onChange={() => setIsAvailable(false)}
                                            />
                                            <label className="form-check-label" htmlFor="notAvailable">Not Available</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Card;
