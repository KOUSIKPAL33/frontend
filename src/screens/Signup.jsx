import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import styles from "./signup.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin,faGoogle } from "@fortawesome/free-brands-svg-icons";
import baseurl from '../Url';

function Signup({ onSignupSuccess, switchToLogin }) {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", cpassword: "", mobileno: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (credentials.name.trim().length == 0) {
                toast.error("Name cannot be left blank. ", {
                    theme: "light",
                    position: "top-center"
                });
                return;
            }
            else if (credentials.password !== credentials.cpassword) {
                toast.error("Password is not matched", {
                    theme: "light",
                    position: "top-center"
                });
                return;
            } else if (credentials.password.length < 8) {
                toast.error("Password must be of length 8.", {
                    theme: "light",
                    position: "top-center"
                })
                return;
            } else if (!/^[6-9]\d{9}$/.test(credentials.mobileno)) {

                toast.error("Enter a valid 10-digit mobile number.", {
                    theme: "light",
                    position: "top-center"
                })
                return;
            }
            const response = await fetch(`${baseurl}/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    mobileno: credentials.mobileno,
                }),
            });

            const responseText = await response.text();
            const json = responseText ? JSON.parse(responseText) : {};

            if (!json.success) {
                toast.error("Email already exits.", {
                    theme: "light",
                    position: "top-center"
                })
            } else {
                toast.success("Registration Successfull", {
                    position: "top-center",
                    theme: "colored"
                })
                setcredentials({
                    name: "",
                    email: "",
                    password: "",
                    mobileno: "",
                });
                navigate("/");
                onSignupSuccess()
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
    };
    const onChangeHandler = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value })

    }
    return (
        <>
            <div className='container'>
                <h1 className={styles.heading}>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating ">
                        <input type="text" className={`${styles.bottom_border} form-control`}
                            name='name' value={credentials.name} onChange={onChangeHandler}
                            placeholder='Name' required />
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="form-floating  ">
                        <input type="email" className={`${styles.bottom_border} form-control`}
                            name='email' value={credentials.email} onChange={onChangeHandler}
                            placeholder='Email Address' required />
                        <label htmlFor="exampleInputEmail1" >Email Address</label>

                    </div>
                    <div className="form-floating  ">
                        <input type="password" className={`${styles.bottom_border} form-control`}
                            name='password' value={credentials.password} onChange={onChangeHandler}
                            placeholder='Password' required />
                        <label htmlFor="exampleInputPassword1" >Password</label>
                    </div>
                    <div className="form-floating  ">
                        <input type="text" className={`${styles.bottom_border} form-control`}
                            name='cpassword' value={credentials.cpassword} onChange={onChangeHandler}
                            placeholder='Confirm Password' required />
                        <label htmlFor="exampleInputPassword1" >Confirm Password</label>
                    </div>
                    <div className="form-floating  ">
                        <input type="number" className={`${styles.mobile} ${styles.bottom_border} form-control`}
                            name='mobileno' value={credentials.mobileno} onChange={onChangeHandler}
                            placeholder='Mobile No' required />
                        <label htmlFor="mobile">Mobile No.</label>
                    </div>
                    <div className="m-3">
                        <input type="checkbox" className={`${styles.check}`} required/>
                        <label htmlFor="">I've read the terms & conditions</label>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                    <div className="mt-3 mb-3">
                        Already a user ?<Link className="m-3" onClick={switchToLogin}>Log in</Link>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div className="fs-5 text-center">sign up with </div>
                        <div className="text-center">
                            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faGoogle} /></Link>
                            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faFacebook} /></Link>
                            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faLinkedin} /></Link>
                            <Link className="btn btn-primary btn-floating m-1"  to="#!" role="button"> <FontAwesomeIcon icon={faTwitter} /></Link>
                        </div>
                    </div>
                </form>
            </div>
        </>

    )
}

export default Signup
