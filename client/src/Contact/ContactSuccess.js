import * as React from 'react';
import { Link } from 'react-router-dom';
import '../Checkout/InfoPage/Success/Success.css'
import '../Checkout/InfoPage/InfoPage.css'
const ContactSuccess = (props) => {
  return (
    <div className='info-page'>
        <div className='info-page-box'>
            <div className='success-pepe' />
            <div className='info-page-description'>
                {"Message has been sent!"}
                <div>
                    <h5>{"Our representative will get to you as soon as possible!"}</h5>
                    <Link to="/">
                        <button className='info-page-btn'>
                        Go to Menu
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ContactSuccess;