import * as React from 'react';
import { Link } from 'react-router-dom';
import './Error.css'
import '../InfoPage.css'

const Error = (props) => {
  return (
    <div className='info-page'>
        <div className='info-page-box'>
            <div className='error-pepe' />
            <div className='info-page-description'>
            {"Order went wrong."}
                <div>
                    <Link to="/contact-us">
                        <button className='info-page-btn'>
                        Contact us
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Error;