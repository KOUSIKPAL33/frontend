import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram, faLinkedin, faWhatsapp,faGithub, } from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <div className="my-5">
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#7c8aab' }}>
        <div className="container pb-0">
          <section>
            <div className="row">
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 style={{ fontSize: '2rem' }}>InCampusFoods</h6>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo possimus ea ducimus ad magnam commodi quibusdam aliquid eligendi fugit ullam.</p>
              </div>
              <hr className="w-100 clearfix d-md-none" />
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Useful links</h6>
                <p><Link className="text-white" to="/">HOME</Link></p>
                <p><Link className="text-white" to="/yummpy">Yummpy</Link></p>
                <p><Link className="text-white" to="/dominos">Domino's</Link></p>
                <p><Link className="text-white" to="/kathijunction">Kathijunction</Link></p>
                <p><Link className="text-white" to="">About Us</Link></p>
                <p><Link className="text-white" to="">Contact Us</Link></p>
              </div>
              <hr className="w-100 clearfix d-md-none" />
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p> <FontAwesomeIcon icon={faMapMarkerAlt} /> NIT-Warangal, Hanamkonda, Telangana, 506004.</p>
                <p> <FontAwesomeIcon icon={faEnvelope} /> incampusfoods2024@gmail.com</p>
                <p> <FontAwesomeIcon icon={faPhone} /> +91 7602783633</p>
                <p> <FontAwesomeIcon icon={faPhone} /> +91 7602783633</p>
              </div>
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Follow us</h6>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#3b5998' }} to="#!" role="button"> <FontAwesomeIcon icon={faFacebook} /></Link>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#55acee' }} to="#!" role="button"><FontAwesomeIcon icon={faTwitter} /></Link>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#dd4b39' }} to="#!" role="button"><FontAwesomeIcon icon={faWhatsapp} /></Link>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#ac2bac' }} to="#!" role="button"><FontAwesomeIcon icon={faLinkedin} /></Link>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#0082ca' }} to="#!" role="button"><FontAwesomeIcon icon={faInstagram} /></Link>
                <Link className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#333333' }} to="#!" role="button"><FontAwesomeIcon icon={faGithub} /></Link>
              </div>
            </div>
          </section>
        </div>
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          © 2024 Copyright: <Link className="text-white" to="https://mdbootstrap.com/">InCampusFoods.com</Link>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
