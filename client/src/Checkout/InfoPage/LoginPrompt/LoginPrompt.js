import * as React from 'react';
import { Link } from 'react-router-dom';
import './LoginPrompt.css'
import '../InfoPage.css'

const LoginPrompt = () => {
  return (
    <div className='info-page'>
        <div className='info-page-box'>
            <div className='login-prompt-pepe' />
            <div className='info-page-description'>
                {"Sign in to see your order."}
                <div>
                    <Link to="/">
                        <button className='info-page-btn'>
                        Sign-In
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LoginPrompt;