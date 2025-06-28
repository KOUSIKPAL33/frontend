import React, { useState } from 'react'
import { toast } from 'react-toastify';
import styles from '../pages/Card.module.css';
import stylesoverlay from "../components/Navbar.module.css";
import stylesform from "../screens/signup.module.css"
import axios from 'axios';
import baseurl from '../Url';


function CardDominos(props) {
  const [price, setPrice] = useState(props.options.Regular);
  const [isAvailable, setIsAvailable] = useState(props.available);
  const [choiceoptions, setOptions] = useState("Regular");
  const [showModal, setShowModal] = useState(false);
  const [updatedName, setUpdatedName] = useState(props.name);
  const [updatedOptions, setUpdatedOptions] = useState(props.options);
  const [updatedImage, setUpdatedImage] = useState(null);

  const handlePriceChange = (event) => {
    const size = event.target.value;
    setPrice(props.options[size]);
    setOptions(size);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${baseurl}/delete/${props.pid}`, {
          data: { shop_name: props.shopname }
        });

        toast.success(response.message || "Product deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Delete error:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedName);
    formData.append('options', JSON.stringify(updatedOptions));
    formData.append('available', isAvailable);

    if (updatedImage) {
      formData.append('image', updatedImage);
    } else {
      formData.append('image', props.imgSrc); // Keep the existing image if no new image is provided
    }
    try {
      const responce= await axios.put(`${baseurl}/dominos/update/${props.pid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success(responce.message || "Product updated!");
      setShowModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <div style={{ width: '16rem' }} className='border border-primary shadow p-3 mb-5 bg-body rounded'>
        <img src={`${baseurl.replace('/api', '')}/${props.imgSrc}`} className="card-img-top" style={{ height: '10rem' }} alt="kousik" />
        <div className="card-body">
          <h5 className="card-title text-truncate ">{props.name}</h5>
          <p className="card-text mb-0">Some quick example text.</p>
          <p className="card-text"><strong>Availble : </strong>{props.available ? ("Yes") : ("No")}</p>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <select name="" onChange={handlePriceChange} className='btn btn-info' style={{ width: "7rem" }}>
                <option value="Regular">Regular</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <button className="btn btn-secondary fs-6" style={{ width: "5rem" }}>Rs.{price}/-</button>
          </div>
          <div className='d-flex justify-content-between align-items-center mt-2'>
            <button className="btn btn-primary " style={{ width: "7rem" }} onClick={() => setShowModal(true)}>Update</button>
            <button className="btn btn-danger" style={{ width: "5rem" }} onClick={handleDeleteProduct}>Delete</button>
          </div>

        </div>
      </div>

      {showModal && (
        <div className={stylesoverlay.modal_overlay}>
          <div className={stylesoverlay.modal_content}>
            <button className={stylesoverlay.close_btn} onClick={() => setShowModal(false)}>✖</button>
            <div className="container">
              <h1 className={stylesform.heading}>Update Product</h1>
              <form onSubmit={handleUpdate} className="container mt-4">
                <div className="mb-3 d-flex align-items-center">
                  <label htmlFor="itemName" className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Item Name :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="itemName"
                    value={updatedName}
                    onChange={e => setUpdatedName(e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label htmlFor="regularPrice" className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Regular Price :</label>
                  <input
                    type="number"
                    className="form-control"
                    id="regularPrice"
                    value={updatedOptions.Regular}
                    onChange={e => setUpdatedOptions({ ...updatedOptions, Regular: e.target.value })}
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label htmlFor="mediumPrice" className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Medium Price :</label>
                  <input
                    type="number"
                    className="form-control"
                    id="mediumPrice"
                    value={updatedOptions.Medium}
                    onChange={e => setUpdatedOptions({ ...updatedOptions, Medium: e.target.value })}
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label htmlFor="largePrice" className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Large Price :</label>
                  <input
                    type="number"
                    className="form-control"
                    id="largePrice"
                    value={updatedOptions.Large}
                    onChange={e => setUpdatedOptions({ ...updatedOptions, Large: e.target.value })}
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Availability :</label>
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
                <div className="mb-3 d-flex align-items-center">
                  <label htmlFor="itemImage" className="form-label mb-0 me-2" style={{ minWidth: 110 }}>Product Image :</label>
                  <input
                    type="file"
                    className="form-control"
                    id="itemImage"
                    accept="image/*"
                    onChange={(e) => setUpdatedImage(e.target.files[0])}
                    style={{ flex: 1 }}
                  />
                </div>
                <div className="mb-3">
                  <small className="form-text text-muted">
                    Leave blank to keep current image.
                  </small>
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CardDominos