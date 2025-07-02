import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseurl from '../Url';

const Contactus = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseurl}/contactus`, form);
      toast.success("Message sent successfully!", { autoClose: 1500 });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#c4e7e8' }}>
        <div className="container">
          <div className="row bg-white rounded shadow p-4 mx-auto ">
            {/* Left: Contact Info */}
            <div className="col-md-4 text-center border-end">
              {/* Address */}
              <div className="mb-5">
                <h5 className="fw-semibold fs-2 text-primary"><FontAwesomeIcon icon={faMapMarkerAlt} /></h5>
                <small className="text-muted">
                  <div className='fs-5 '>NIT-Warangal</div>
                  <div>Hanamkonda, Warangal</div>
                </small>
              </div>
              {/* Phone */}
              <div className="mb-5">
                <div className='fs-2 text-primary'><FontAwesomeIcon icon={faPhone} /></div>
                <small className="text-muted">
                  <div>+91 7602783633</div>
                  <div>+91 7602783633</div>
                </small>
              </div>
              {/* Email */}
              <div>
                <h5 className="fw-semibold fs-2 text-primary"><FontAwesomeIcon icon={faEnvelope} /></h5>
                <small className="text-muted">incampusfood2025@gmail.com</small>
              </div>
            </div>
            {/* Right: Form */}
            <div className="col-md-8 ps-md-4 mt-4 mt-md-0">
              <h3 className="text-primary fw-bold mb-3">Send us a message</h3>
              <p className="text-muted mb-4">
                If you have any work for us or queries related to our service, you can send a message from here. It's our pleasure to help you.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    placeholder="Write your message"
                    className="form-control"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary fs-5" style={{ width: "7rem" }} disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contactus;