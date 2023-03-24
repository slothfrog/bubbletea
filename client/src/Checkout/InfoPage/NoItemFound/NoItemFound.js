import * as React from 'react';
import { Link } from 'react-router-dom';
import './NoItemFound.css'
import '../InfoPage.css'

const NoItemFound = () => {
  return (
    <div className='info-page'>
        <div className='info-page-box'>
            <div className='no-item-found-pepe' />
            <div className='info-page-description'>
                No Item was Added to the Cart
                <div>
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

export default NoItemFound;