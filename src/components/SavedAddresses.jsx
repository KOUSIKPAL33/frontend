import React from 'react'
import Showaddress from './Showaddress';
import {useState, useContext,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseurl from '../Url';
import { userContext } from "../contexts/userContext";


function SavedAddresses() {
    const { user } = useContext(userContext);
    const [addresses, setAddresses] = useState(user.addresses || []);
    const [address, setAddress] = useState({ name: "", mobileno: "", location: "" });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const token = localStorage.getItem("authToken");

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
                toast.error("Failed to add address", { autoClose: 1500, });
            return; }
            toast.success("Address is added successfully", { autoClose: 1500, })
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
    return (
        <>
            <div className="card p-4" style={{ backgroundColor: "#f8f9fa" }}>
                <h5>Saved Addresses</h5>
                {addresses.length === 0 ? (
                    <p className='fs-5'>You have no saved addresses</p>
                ) : (
                    <div className='d-flex flex-column gap-2'>
                        {addresses.map((addr, idx) => (
                            <div key={idx}>
                                <Showaddress
                                    id={addr._id}
                                    name={addr.name}
                                    mobileno={addr.mobileno}
                                    location={addr.location}
                                    onDelete={handleDeleteAddress}
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
        </>
    )
}

export default SavedAddresses
