import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import Showaddress from './Showaddress';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from './checkout.module.css'
import { totalItem, totalPrice } from '../contexts/Cartreducer';
import { cartcontext } from '../contexts/Contextprovider';
import { userContext } from "../contexts/userContext";
import baseurl from '../Url';

function Checkout() {
    const { user } = useContext(userContext);
    const { cart } = useContext(cartcontext)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [addresses, setAddresses] = useState(user.addresses);
    const [address, setAddress] = useState({ name: "", mobileno: "", location: "" });
    const navigate = useNavigate();

    const itemTotal = totalPrice(cart);
    const gst = Math.floor(itemTotal * .05);
    const deliveryfee = ((itemTotal >= 300) ? 0 : 30);
    const grandTotal = (itemTotal) + gst + deliveryfee;
    const token = localStorage.getItem('authToken');
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const addressDetails = {
                addressDetails: {
                    name: address.name,
                    mobileno: address.mobileno,
                    location: address.location,
                }
            };
            const response = await axios.post(`${baseurl}/address/add`,
                addressDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (!response) {
                console.log("error in response");
            }
            toast.success("Address is added successfully", {
                theme: "colored",
                autoClose: 1500,
            })
            setAddress({
                name: "",
                mobileno: "",
                location: "",
            });
            setAddresses([...addresses, addressDetails.addressDetails]);
            setIsFormOpen(!isFormOpen);
        } catch (error) {
            console.error("Error during submission:", error);
        }
    }
    const onChangeHandler = (event) => {
        setAddress({ ...address, [event.target.name]: event.target.value })
    }
    const handleDeleteAddress = (addressId) => {
        const updatedAddresses = addresses.filter((add) => add._id !== addressId);
        setAddresses(updatedAddresses);
    };
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
    };

    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);


    const handleMakeOrder = async () => {
        try {
            if (!selectedAddress) {
                toast.error("No delivery address selected or available.",{
                    autoClose:1500,
                });
                return;
            }
            const response = await axios.post(`${baseurl}/order/create`, {
                userId: user._id,
                items: cart,
                deliveryLocation: selectedAddress.location,
                totalAmount: grandTotal
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Order placed successfully!",{
                    autoClose:1400,
                }
                );
                setTimeout(() => {
                    navigate("/Myorders");
                }, 1500);
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to place order");
        }
    };


    return (
        <div className='m-4 d-flex gap-4 flex-row'>
            <div className="col-1 mt-4 "><Link to={"/Mycart"} className='btn btn-primary w-100'><FontAwesomeIcon icon={faArrowAltCircleLeft} /> Cart</Link></div>
            <div className="col-6 m-4 d-flex flex-column gap-2">
                <div className={`${styles.bg_color_radius}`}>
                    <h5><span className='btn btn-primary'>1 </span> Personal Details</h5>
                    <div className='d-flex justify-content-between px-5'>

                        <p><b>Name: </b> {user.name}</p>
                        <p><b>Mobile no:</b> {user.mobile}</p>
                    </div>
                </div>
                <div className={`${styles.bg_color_radius}`}>
                    <h5><span className='btn btn-primary'>2 </span> Delivery Address</h5>
                    <div >
                        {addresses.length == 0 ? (
                            <p className='fs-5'>You have no saved addresses</p>) : (
                            <div className='d-flex flex-column gap-2'>
                                {
                                    addresses.map((data) => (
                                        <div key={data._id} >
                                            <Showaddress
                                                id={data._id}
                                                name={data.name}
                                                mobileno={data.mobileno}
                                                location={data.location}
                                                onDelete={handleDeleteAddress}
                                                isSelected={selectedAddressId === data._id}
                                                onSelect={handleSelectAddress}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                    </div>
                    <div className="">
                        <button onClick={() => setIsFormOpen(!isFormOpen)} className='btn btn-primary'>
                            + Add new address
                        </button>
                        {isFormOpen && (
                            <form className="row mt-4">
                                <div className="col">
                                    <input type="text" className="form-control" name='name' placeholder="Name" value={address.name} onChange={onChangeHandler} required />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" name='mobileno' placeholder="Mobile No" value={address.mobileno} onChange={onChangeHandler} required />
                                </div>
                                <div className="mt-4">
                                    <input type="text" className="form-control" name='location' placeholder="Delivery Location" value={address.location} onChange={onChangeHandler} required />
                                </div>
                                <div className='mt-4 d-flex gap-4'>
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                                    <button className='btn btn-primary' onClick={() => { setIsFormOpen(!isFormOpen) }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className='col-3 m-4'>
                <div className={styles.bg_color_radius}>
                    <h2>Bill Details</h2>
                    <div className='d-flex flex-column gap-3 fs-5'>
                        <div className='d-flex justify-content-between'>
                            <div>Item total ({totalItem(cart)})</div>
                            <div>₹{itemTotal}</div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div>Delivery Fee</div>
                            <div>{itemTotal >= 300 ? "Free" : "₹30"}</div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div>Gst</div>
                            <div>₹{gst}</div>
                        </div>
                        <div className='d-flex justify-content-between '>
                            <div>Total Amount</div>
                            <div>₹{grandTotal}</div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.bg_color_radius}`}>
                    <div className='btn btn-primary fs-5' onClick={handleMakeOrder}>Make Order</div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
