import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserEdit, faCreditCard, faAddressBook, faBoxOpen, faSignOut, faEdit, faChartBar, faCartPlus, faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseurl from '../Url';
import { toast } from 'react-toastify';
import AdminStat from './AdminStat';

const Stat = ({ shop, orders }) => {
    return (
        <>
            <AdminStat shop={shop} orders={orders} />
        </>
    );
};
const EditPersonalInfo = ({ user, setPreview, setUser }) => {
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

        const token = localStorage.getItem("authToken");
        const data = new FormData();
        data.append("name", form.name);
        data.append("email", form.email);
        data.append("mobile", form.mobile);
        if (file) {
            data.append("profileImage", file);
        }

        try {
            const shop = localStorage.getItem("shop");
            const res = await axios.post(`${baseurl}/admin/update/${shop}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                setUser((prev) => ({
                    ...prev,
                    ...form,
                    profileImage: res.data.profileImage,
                }));
                setPreview(res.data.profileImage);
                toast.success("Profile updated successfully", { autoClose: 1500 });
            } else {
                toast.error("Failed to update profile", { autoClose: 1500 });
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Something went wrong", { autoClose: 1500 });
        }
    };

    return (
        <div className="card p-4">
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <div className="position-relative mx-auto mb-2" style={{ width: 90, height: 90 }}>
                        {image ? (
                            <img
                                src={
                                    image.startsWith("http") || image.startsWith("data:")
                                        ? image
                                        : `${baseurl.replace("/api", "")}${image}`
                                }
                                alt="Profile"
                                className="rounded-circle"
                                style={{
                                    width: 90,
                                    height: 90,
                                    objectFit: "cover",
                                    border: "2px solid #007bff",
                                }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{
                                    width: 90,
                                    height: 90,
                                    fontSize: 32,
                                    fontWeight: "bold",
                                    border: "2px solid #007bff",
                                }}
                            >
                                {form.name && form.name[0]
                                    ? form.name[0].toUpperCase()
                                    : <FontAwesomeIcon icon={faUser} />}
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

                <button className="btn btn-primary" type="submit">
                    Update
                </button>
            </form>
        </div>
    );
};
const Neworders = ({ orders, loading }) => {


    const pendingOrders = orders
        .filter(order => order.shopOrder?.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="card p-4">
            <h2 className="text-primary text-center">New Orders</h2>
            {loading && <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>}
            {pendingOrders.length === 0 ? (
                <p>No new (pending) orders.</p>
            ) : (
                pendingOrders.map(order => (
                    <div key={order._id} className="border rounded p-3 mb-3 shadow-sm">
                        <div className="d-flex justify-content-between">
                            <div className="w-50 pe-3 text-start">
                                <h5>Order Details</h5>
                                <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                                <div><strong>Total Items:</strong> {order.shopOrder.items.length}</div>
                                <div>
                                    <strong>Total Quantiy:</strong>{" "}
                                    {order.shopOrder.items.reduce((total, item) => total + (item.quantity || 0), 0)}
                                </div>

                                <div><strong>Total Price:</strong> ₹{order.shopOrder?.shopTotal}</div>
                            </div>
                            <div className="w-50 pe-3 text-start">
                                <h5>Address</h5>
                                <strong>Customer:</strong> {order.deliveryLocation?.name}<br />
                                <strong>Phone:</strong> {order.deliveryLocation?.mobileno}<br />
                                <strong>Location:</strong> {order.deliveryLocation?.location}
                            </div>
                        </div>
                        <div className="mt-2">
                            <strong>Status:</strong> <span className="badge bg-warning text-dark">{order.shopOrder.status}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
const Addcategory = ({ shop }) => {
    const [category, setCategory] = useState('');

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseurl}/category/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category, shop })
            });

            if (response.ok) {
                setCategory('');
                toast.success("Category Added Successfully.", {
                    autoClose: 1500,
                });
            } else {
                toast.error('Failed to add category', { autoClose: 1500 });
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }
    return (
        <div className="card p-4">
            <h2 className="text-primary">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder='Enter category name'
                        required
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Add Category</button>
                </div>
            </form>


        </div>
    );
};
const Addproduct = ({ shop }) => {
    const apiEndpoint = `${baseurl}/${shop}_data`;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [options, setOptions] = useState([]);
    const categoryOptions = options.find(f => f.filterName === "Category")?.values || [];
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('shop', shop); // pass shop name or ID
        formData.append('image', image);
        formData.append('category', category);
        try {
            const response = await fetch(`${baseurl}/product/add`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {

                setName('');
                setPrice('');
                setImage(null);
                toast.success("Product Added Succesfully.", {
                    autoClose: 1500,
                })
            } else {
                alert('Failed to add product');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };
    const loadData = async () => {
        try {
            let response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            response = await response.json();
            setOptions(response[1]);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };
    useEffect(() => {
        loadData();
    }, [apiEndpoint]);
    return (
        <div className="card p-4">
            <h2 className="text-primary text-center">Add a New Product</h2>
            <form onSubmit={handleAddProduct} className="mt-4" encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Item Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter item name'
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="itemPrice" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='Enter item price'
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="itemImage" className="form-label">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="itemImage"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="itemCategory" className="form-label">Category</label>
                    <select
                        id="itemCategory"
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">-- Select Category --</option>
                        {categoryOptions.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>


                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </div>
            </form>

        </div>
    );
};
function Dashboard({ shop }) {
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [preview, setPreview] = useState('');
    const [activeTab, setActiveTab] = useState('neworders');
    const [neworderslength, setNeworderslength] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("shop");
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${baseurl}/admin/${shop}`);
                if (res.data.success) {
                    setUser(res.data.data);
                    setPreview(res.data.data.profileImage);
                }
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            }
        };

        fetchAdmin();
    }, [shop]);
    const token = localStorage.getItem("authToken");


    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseurl}/order/shopget/${shop}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setOrders(response.data);
                setNeworderslength(response.data.filter(order => order.shopOrder.status === 'pending').length);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && shop) fetchOrders();
    }, [token, shop]);


    let rightContent = (
        <div className="text-center text-muted mt-5">
            <span>Select an option from the left menu.</span>
        </div>
    );
    if (activeTab === 'stat') rightContent = <Stat shop={shop} orders={orders} />;
    if (activeTab === 'edit') rightContent = <EditPersonalInfo user={user} setPreview={setPreview} setUser={setUser} />;
    if (activeTab === 'neworders') rightContent = <Neworders shop={shop} orders={orders} loading={loading} />;
    if (activeTab === 'addcategory') rightContent = <Addcategory shop={shop} />;
    if (activeTab === 'addproduct') rightContent = <Addproduct shop={shop} />;

    return (
        <div className='container mt-5'>
            <div className="row" >
                <div className="col-md-4 mb-4">
                    <div className="bg-light rounded p-4 text-center"
                        style={{ position: "sticky", top: "100px", zIndex: 1 }}>
                        <div className="position-relative mx-auto mb-3" style={{ width: 100, height: 100 }}>
                            {preview ? (
                                <img
                                    src={`${baseurl.replace('/api', '')}${preview}`}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{
                                        width: 100, height: 100,
                                        objectFit: "cover",
                                        border: "2px solid #007bff"
                                    }}
                                />
                            ) : (
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: 100, height: 100, fontSize: 40, fontWeight: "bold", border: "2px solid #007bff" }}>
                                    {user.name ? user.name[0].toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <h4 className="mb-1">{user.name}</h4>
                            <div className="text-muted">{user.mobile}</div>
                            <div className="text-muted mb-1">{user.email}</div>
                        </div>

                        <div className="list-group mt-4">
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("stat")}>
                                <FontAwesomeIcon icon={faChartBar} /> Stat
                            </button>
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("edit")}>
                                <FontAwesomeIcon icon={faUserEdit} /> Edit Personal Information
                            </button>
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("neworders")}>
                                <FontAwesomeIcon icon={faCartPlus} /> New Order {neworderslength > 0 && <span className="badge bg-danger ms-2">{neworderslength}</span>}
                            </button>
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("addcategory")}>
                                <FontAwesomeIcon icon={faBoxes} /> Add Category
                            </button>
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => setActiveTab("addproduct")}>
                                <FontAwesomeIcon icon={faCube} /> Add Product
                            </button>
                            <button className="list-group-item list-group-item-action d-flex align-items-center gap-2 text-danger" style={{ border: "none", background: "none" }}
                                onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOut} /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    {rightContent}
                </div>
            </div>
        </div>
    );
}
export default Dashboard
