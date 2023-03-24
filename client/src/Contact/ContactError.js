import * as React from 'react';
import { Link } from 'react-router-dom';
import '../Checkout/InfoPage/Error/Error.css'
import '../Checkout/InfoPage/InfoPage.css'

const ContactError = (props) => {
  return (
    <div className='info-page'>
        <div className='info-page-box'>
            <div className='error-pepe' />
            <div className='info-page-description'>
            {"Uh oh! Something went wrong."}
            <br></br>
            {"Please try again later."}
            <Link to="/">
                <button className='info-page-btn'>
                    Go Home
                </button>
            </Link>
            </div>
            
        </div>
    </div>
  );
}

export default ContactError;