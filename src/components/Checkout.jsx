import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import Showaddress from './Showaddress';
import toast  from 'react-hot-toast';
import axios from 'axios';
import styles from './checkout.module.css'
import { totalItem, totalPrice } from '../contexts/Cartreducer';
import { cartcontext } from '../contexts/Contextprovider';
import { userContext } from "../contexts/userContext";
import baseurl from '../Url';
import Navbar from './Navbar';


function Checkout() {
    const { user } = useContext(userContext);
    const { cart } = useContext(cartcontext)
    const [addresses, setAddresses] = useState(user.addresses || []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [address, setAddress] = useState({ name: "", mobileno: "", location: "" });
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("online");
    const navigate = useNavigate();
    const [razorpayKey, setRazorpayKey] = useState(null);
    const itemTotal = totalPrice(cart);
    //const gst = Math.floor(itemTotal * .05);
    const gst = 0;
    const deliveryfee = ((itemTotal >= 300) ? 0 : 30);
    const grandTotal = (itemTotal) + gst + deliveryfee;
    const token = localStorage.getItem('authToken');

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const addNewAddress = async (e) => {
        e.preventDefault();
        try {
            const addressDetails = {
                addressDetails: {
                    name: address.name,
                    mobileno: address.mobileno,
                    location: address.location,
                }
            };
            const response = await axios.post(`${baseurl}/address/add`, addressDetails, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            );
            if (!response) {
                toast.error("Failed to add address", { duration: 1500, });
                return;
            }
            toast.success("Address is added successfully", { duration: 1500, })
            setAddress({ name: "", mobileno: "", location: "", });
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


    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
    };

    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

    // Create order with payment status
    const createOrder = async (paymentStatus = 'pending', paymentId = null) => {
        try {
            const orderData = {
                userId: user._id,
                items: cart,
                deliveryLocation: selectedAddress,
                totalAmount: grandTotal,
                paymentMethod: paymentMethod,
                paymentStatus: paymentStatus,
                paymentId: paymentId
            };

            const response = await axios.post(`${baseurl}/order/create`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Order placed successfully!", {
                    duration: 1000,
                });
                setTimeout(() => {
                    navigate("/Myorders");
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order");
        }
    };

    // Handle Razorpay payment
    const handleRazorpayPayment = async () => {
        try {
            // First create order on your backend to get order ID
            const orderResponse = await axios.post(`${baseurl}/order/create-razorpay-order`, {
                amount: grandTotal * 100, // Razorpay expects amount in paise
                currency: 'INR',
                receipt: `order_${Date.now()}`
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!orderResponse.data.orderId) {
                toast.error("Failed to create payment order");
                return;
            }

            const options = {
                key: razorpayKey,
                amount: grandTotal * 100,
                currency: "INR",
                name: "InCampusFood",
                description: "Payment for your order",
                order_id: orderResponse.data.orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(`${baseurl}/order/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        });

                        if (verifyResponse.data.verified) {
                            await axios.post(`${baseurl}/order/create`, {
                                userId: user._id,
                                items: cart,
                                deliveryLocation: selectedAddress,
                                totalAmount: grandTotal,
                                paymentMethod: "online",
                                paymentStatus: "completed",
                                paymentId: response.razorpay_payment_id
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                }
                            });

                            toast.success("Order placed successfully!", { duration: 1000 });
                            setTimeout(() => {
                                navigate("/Myorders");
                            }, 1000);
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.mobile
                },
                theme: {
                    color: "#3399cc"
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "UPI",
                                instruments: [{ method: "upi" }]
                            },
                            cards: {
                                name: "Cards",
                                instruments: [{ method: "card" }]
                            },
                            netbanking: {
                                name: "Netbanking",
                                instruments: [{ method: "netbanking" }]
                            },
                            wallets: {
                                name: "Wallets",
                                instruments: [{ method: "wallet" }]
                            },
                        },
                        sequence: ["block.upi", "block.cards", "block.netbanking", "block.wallets"],
                        preferences: {
                            show_default_blocks: false
                        }
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            toast.error("Failed to initiate payment");
        }
    };

    const handleMakeOrder = async () => {
        try {
            if (!selectedAddress) {
                toast.error("No delivery address selected or available.", {
                    duration: 1500,
                    position: "top-center",
                    
                });
                return;
            }

            if (paymentMethod === 'cod') {

                await createOrder('pending');
            } else if (paymentMethod === 'online') {
                await handleRazorpayPayment();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order");
        }
    };

    useEffect(() => {
        setAddresses(user.addresses || []);
        const fetchRazorpayKey = async () => {
            try {
                const response = await axios.get(`${baseurl}/config/razorpay`);
                setRazorpayKey(response.data.key);
            } catch (error) {
                console.error("Error fetching Razorpay key:", error);
            }
        };
        fetchRazorpayKey();
    }, [user.addresses]);

    // ...existing imports and code...

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                <div className="row">
                    <div className="col-12 col-lg-8 mb-4">
                        <div className="d-flex flex-column gap-2">
                            <div className={`${styles.bg_color_radius}`}>
                                <h5><span className='btn btn-secondary disabled '>1 </span> Personal Details</h5>
                                <div className='d-flex justify-content-between px-5'>
                                    <p><b>Name: </b> {user.name}</p>
                                    <p><b>Mobile no:</b> {user.mobile}</p>
                                </div>
                            </div>
                            <div className={`${styles.bg_color_radius}`}>
                                <h5><span className='btn btn-secondary disabled'>2 </span> Delivery Addresses</h5>
                                <div>
                                    {addresses.length === 0 ? (
                                        <p className='fs-5'>You have no saved addresses</p>
                                    ) : (
                                        <div className='d-flex flex-column gap-2'>
                                            {addresses.map((data) => (
                                                <div key={data._id}>
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button onClick={() => setIsFormOpen(!isFormOpen)} className='btn btn-primary'>
                                        + Add new address
                                    </button>
                                    {isFormOpen && (
                                        <form className="row mt-4" onSubmit={addNewAddress}>
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
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                                <button type="button" className="btn btn-primary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                            {/* Payment Method Selection */}
                            <div className={`${styles.bg_color_radius}`}>
                                <h5><span className='btn btn-secondary disabled'>3 </span> Payment Method</h5>
                                <div className='d-flex flex-column gap-3'>
                                    <div className='form-check'>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="cod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="cod">
                                            <strong>Cash on Delivery (COD)</strong>
                                            <br />
                                            <small className="text-muted">Pay when you receive your order</small>
                                        </label>
                                    </div>
                                    <div className='form-check'>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="online"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="online">
                                            <strong>Pay Online</strong>
                                            <br />
                                            <small className="text-muted">Secure payment via Razorpay</small>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Bill Details (1/3 width on large screens) */}
                    <div className="col-12 col-lg-4">
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
                        <div className={`${styles.bg_color_radius} mt-3`}>
                            <div className='btn btn-primary fs-5 w-100' onClick={handleMakeOrder}>
                                {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Online'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Checkout
