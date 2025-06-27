import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt,faEnvelope,faPhone} from '@fortawesome/free-solid-svg-icons';


const Contactus = () => {
  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#c4e7e8' }}>
      <div className="container">
        <div className="row bg-white rounded shadow p-4 mx-auto">
          {/* Left: Contact Info */}
          <div className="col-md-5 text-center border-end">
            {/* Address */}
            <div className="mb-5">
              <div className="mb-2 text-primary">
                <i className="bi bi-geo-alt-fill fs-3"></i>
              </div>
              <h5 className="fw-semibold"><FontAwesomeIcon icon={faMapMarkerAlt}/></h5>
              <small className="text-muted">
                <div>NIT-Warangal</div>
                <div>Hanamkonda, Warangal</div>
              </small>
            </div>

            {/* Phone */}
            <div className="mb-5">
              <div className="mb-2 text-primary">
                <i className="bi bi-telephone-fill fs-3"></i>
              </div>
              <div className=''><FontAwesomeIcon icon={faPhone}/></div>
              <small className="text-muted">
                <div>+91 7602783633</div>
                <div>+91 7602783633</div>
              </small>
            </div>

            {/* Email */}
            <div>
              <div className="mb-2 text-primary">
                <i className="bi bi-envelope-fill fs-3"></i>
              </div>
              <h5 className="fw-semibold"><FontAwesomeIcon icon={faEnvelope}/></h5>
              <small className="text-muted">sportcheck123@gmail.com</small>
            </div>
          </div>

          {/* Right: Form */}
          <div className="col-md-7 ps-md-4 mt-4 mt-md-0">
            <h3 className="text-primary fw-bold mb-3">Send us a message</h3>
            <p className="text-muted mb-4">
              If you have any work for us or queries related to our service, you can send a message from here. It's our pleasure to help you.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div className="mb-3">
                <input type="text" placeholder="Enter your name" className="form-control" required />
              </div>
              <div className="mb-3">
                <input type="email" placeholder="Enter your email" className="form-control" required />
              </div>
              <div className="mb-3">
                <textarea placeholder="Write your message" className="form-control" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
