import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import SavedAddresses from './SavedAddresses';
import { userContext } from "../contexts/userContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOut, faReceipt, faEdit, faUserEdit, faCreditCard, faAddressBook, faBoxOpen, faDashboard } from "@fortawesome/free-solid-svg-icons";
import baseurl from "../Url";
import { toast } from 'react-toastify';
import SpendingBarChart from './SpendingBarChart';


const EditPersonalInfo = ({ user, onUpdate }) => {
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
    });
    const [image, setImage] = useState(user.profileImage || "");
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onUpdate(form, file);
    };

    return (
        <div className="card p-4">
            <h5>Edit Personal Information</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <div className="position-relative mx-auto mb-2" style={{ width: 90, height: 90 }}>
                        {image ? (
                            <img
                                src={
                                    image.startsWith("http") || image.startsWith("data:")
                                        ? image
                                        : `${baseurl.replace('/api', '')}${image}`
                                }
                                alt="Profile"
                                className="rounded-circle"
                                style={{ width: 90, height: 90, objectFit: "cover", border: "2px solid #007bff" }}
                            />
                        ) : (
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{ width: 90, height: 90, fontSize: 32, fontWeight: "bold", border: "2px solid #007bff" }}>
                                {form.name && form.name[0] ? form.name[0].toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                            </div>
                        )}
                        <button
                            className="btn btn-sm btn-light position-absolute"
                            style={{ bottom: 0, right: 0, borderRadius: "50%", border: "1px solid #007bff" }}
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            title="Edit Profile Image"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input className="form-control" name="mobile" value={form.mobile} onChange={handleChange} required />
                </div>
                <button className="btn btn-primary" type="submit">Update</button>
            </form>
        </div>
    );
};


const SavedCards = () => {
    // Static card data
    const cards = [
        {
            id: 1,
            name: "Kousik Kumar",
            number: "1234 5678 9012 3456",
            expiry: "12/27",
            type: "Visa",
            bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            id: 2,
            name: "Kousik Kumar",
            number: "9876 5432 1098 7654",
            expiry: "08/26",
            type: "Mastercard",
            bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
        }
    ];

    return (
        <div className="card p-4">
            <h5 className="mb-4">Saved Cards</h5>
            <div className="row g-3 justify-content-center">
                {cards.map(card => (
                    <div key={card.id} className="col-12 col-sm-6 col-lg-5 d-flex justify-content-center">
                        <div
                            className="rounded shadow p-3 text-white w-100"
                            style={{
                                background: card.bg,
                                minHeight: 170,
                                maxWidth: 320,
                                width: "100%",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold">{card.type}</span>
                                <img
                                    src={card.type === "Visa"
                                        ? "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                                        : "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"}
                                    alt={card.type}
                                    style={{ height: 32, background: "#fff", borderRadius: 6, padding: "2px 8px" }}
                                />
                            </div>
                            <div className="fs-4 fw-bold letter-spacing-wider mb-2" style={{ letterSpacing: 2 }}>
                                **** **** **** {card.number.slice(-4)}
                            </div>
                            <div className="d-flex justify-content-between align-items-end">
                                <div>
                                    <div className="small">Card Holder</div>
                                    <div className="fw-semibold">{card.name}</div>
                                </div>
                                <div>
                                    <div className="small">Expires</div>
                                    <div className="fw-semibold">{card.expiry}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const Dashboard = () => {
    const token = localStorage.getItem("authToken");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseurl}/order/get`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const formatDate = (isoDate) =>
        new Date(isoDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });

    return (
        <div className="card p-4">
            <h3 className="mb-4">Dashboard</h3>

            {loading ? (
                <div className="text-center">Loading orders...</div>
            ) : (
                <>
                    {/* Summary Section */}
                    <div className="mb-4">
                        <div className="row text-center d-flex justify-content-around g-3">
                            <div className="col-sm-6 p-3" style={{ background: "linear-gradient(135deg,rgb(124, 131, 163) 0%, #764ba2 100%)", width: "30%", color: "#fff", borderRadius: "10px" }}>
                                <h5>Total Orders</h5>
                                <p className="fs-4 fw-semibold" >{orders.length}</p>
                            </div>
                            <div className="col-sm-6 p-3" style={{ background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", width: "30%", color: "#fff", borderRadius: "10px" }}>
                                <h5>Total Spent</h5>
                                <p className="fs-4 fw-semibold">₹{totalSpent}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <h5 className="mb-3">Recent Orders</h5>
                    {orders.length === 0 && (
                        <div className="text-center text-muted mt-4">
                            No order placed yet.
                        </div>
                    )}
                    {orders.length > 0 && orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="border rounded p-3 mb-3 shadow-sm">
                            <div className="row">

                                <div><strong>Order Date:</strong> {formatDate(order.createdAt)}</div>

                                <div><strong>Total:</strong> ₹{order.totalAmount}</div>

                                <div><strong>Shops:</strong>{" "}
                                    {order.ordersbyshop.map((s) => s.shopName).join(", ")}</div>

                                <div><span
                                    className={`badge bg-${order.status === "delivered"
                                        ? "success"
                                        : order.status === "out for delivery"
                                            ? "info"
                                            : "secondary"
                                        } text-lowercase`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {order.status}
                                </span></div>
                            </div>
                        </div>
                    ))}
                    {/*charts*/}
                    <div>
                        <SpendingBarChart orders={orders} />
                    </div>

                </>
            )}
        </div>
    );
};

function Profile() {
    const { user, dispatchUser } = useContext(userContext);
    const [preview, setPreview] = useState(user.profileImage || "");
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();
    const handleUpdateProfile = async (form, file) => {
        try {
            const token = localStorage.getItem("authToken");
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("mobile", form.mobile);
            if (file) {
                formData.append("image", file);
            }

            const response = await fetch(`${baseurl}/update-profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                dispatchUser({
                    type: "SET_USER",
                    payload: {
                        ...user,
                        name: data.user.name,
                        email: data.user.email,
                        mobile: data.user.mobileno,
                        profileImage: data.user.profileImage,
                        addresses: data.user.addresses,
                    },
                });
                setPreview(data.user.profileImage);
                toast.success("Profile updated successfully!");

            } else {
                toast.error(data.message || "Failed to update profile");
                console.error("Update error:", data);
            }
        } catch (error) {
            toast.error("Error updating profile");
            console.error("Error updating profile:", error);

        }
    };
    const handleImageUpdate = (img) => {
        setPreview(img);
    };
    let rightContent = (
        <div className="text-center text-muted mt-5">
            <span>Select an option from the left menu.</span>
        </div>
    );
    if (activeTab === "dashboard") rightContent = <Dashboard user={user} />;
    if (activeTab === "edit") rightContent = <EditPersonalInfo user={user} onUpdate={handleUpdateProfile} onImageUpdate={handleImageUpdate} />;
    if (activeTab === "cards") rightContent = <SavedCards />;
    if (activeTab === "addresses") rightContent = <SavedAddresses />;

    const handleLogout = () => {
        localStorage.setItem("isLoggedIn", false);
        localStorage.removeItem("authToken");
        navigate("/", { replace: true });
        window.location.reload();
    };

    return (
        <>
            <Navbar />
            <div className="container pt-5 mt-5">
                <div className="row">
                    {/* Fixed Left Sidebar */}
                    <div className="col-md-4 mb-4">
                        <div
                            className="bg-light rounded p-4 text-center"
                            style={{
                                position: "sticky",
                                top: "100px",
                                zIndex: 1
                            }}
                        >
                            <div className="position-relative mx-auto mb-3" style={{ width: 100, height: 100 }}>
                                {preview ? (
                                    <img
                                        src={`${baseurl.replace('/api', '')}${preview}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            border: "2px solid #007bff"
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            border: "2px solid #007bff"
                                        }}
                                    >
                                        {user.name && user.name[0] ? user.name[0].toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                                    </div>
                                )}
                            </div>
                            <div className="mt-3">
                                <h4 className="mb-1">{user.name}</h4>
                                <div className="text-muted">{user.mobile}</div>
                                <div className="text-muted mb-1">{user.email}</div>
                            </div>
                            <div className="list-group mt-4">
                                <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("dashboard")}>
                                    <FontAwesomeIcon icon={faDashboard} /> Dashboard
                                </button>
                                <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("edit")}>
                                    <FontAwesomeIcon icon={faUserEdit} /> Edit Personal Information
                                </button>
                                <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("cards")}>
                                    <FontAwesomeIcon icon={faCreditCard} /> Saved Cards
                                </button>
                                <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("addresses")}>
                                    <FontAwesomeIcon icon={faAddressBook} /> Saved Addresses
                                </button>
                                <Link to="/myorders" className="list-group-item list-group-item-action d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faBoxOpen} /> My Orders
                                </Link>
                                <button className="list-group-item list-group-item-action d-flex align-items-center gap-2 text-danger" style={{ border: "none", background: "none" }}
                                    onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOut} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Right Content */}
                    <div className="col-md-8">
                        {rightContent}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Profile