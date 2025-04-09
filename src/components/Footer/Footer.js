import React from 'react'
import "./Footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { faCoffee } from '@fortawesome/free-solid-svg-icons'; 
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Footer() {
  return (
    <div className='wholeFooter'> 

        <div className='footer'>

            <div className='footerleft'>
                <div>
                    <h1>Precision Farming</h1>
                </div>
                <div className='socialmedia'>
                    {/* <FontAwesomeIcon icon={faCoffee} /> */}
                    <a href=''> 
                        <FontAwesomeIcon icon={faFacebook} className='icon'/>
                    </a>

                    <a href=''>
                        <FontAwesomeIcon icon={faInstagram} className='icon'/>
                    </a>

                    <a href=''>
                    <FontAwesomeIcon icon={faLinkedin} className='icon'/>
                    </a>
                </div>
            </div>

            <div className='footermiddle'>
                <div className='middleleft'>
                    <h4> Quick Links</h4>

                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        <li>
                            <Link to="/getstarted">Get Started</Link>
                        </li>

                        <li>
                            <Link to="/history">View History</Link>
                        </li>

                        <li>
                            <Link to="/features">Features</Link>
                        </li>

                        <li>
                            <Link to="/contact">Contact Us</Link>  
                        </li>

                    </ul>
                </div>

                <div className='middleright'>
                    <h4>Contact</h4>
                    <div>
                        <h5>India:</h5>
                        <div>
                            <i class="fa-solid fa-location-dot"></i>
                            <h6>Nashik - 422003</h6>
                        </div>

                        <div>
                            <i class="fa-solid fa-phone"></i>
                            <h6>+91 9876543210</h6>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>

    </div>
  )
}

export default Footer;
