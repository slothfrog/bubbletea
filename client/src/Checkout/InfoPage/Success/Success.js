import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseQuery } from '../../../utils/ParseQuery';
import { paymentApi } from '../../../api/PaymentAPI.js';
import './Success.css'
import '../InfoPage.css'
import AddToCalendar from './AddToCalendar/AddToCalendar';
import Loading from '../../../shared/Loading/Loading';

const Success = () => {
    const query = parseQuery(window.location.search)
    const orderId = window.location.pathname.split("/")[2]
    const isPaypal = query.paymentMethod === "paypal"
    const [isSuccessSent, setIsSuccessSent] = useState(false)
    const [orderFinialied, setOrderFinialied] = useState(false)
    
    useEffect(()=>{
        if(query && isPaypal && orderId && !isSuccessSent) {
            paymentApi.paypalSuccess(orderId, query, ()=>setOrderFinialied(true))
            setIsSuccessSent(true)
        }
    }, [isPaypal, isSuccessSent, orderId, query])
    
    return (!isPaypal||orderFinialied) ? (
        <div className='info-page'>
            <div className='info-page-box'>
                <div className='success-pepe' />
                <div className='info-page-description'>
                    <li>{"Order#"+orderId}</li>
                    <li> was successfully placed!</li>
                    <div>
                        <Link to="/">
                            <button className='info-page-btn'>
                            Order More
                            </button>
                        </Link>
                        <AddToCalendar orderId={orderId} />
                    </div>
                </div>
            </div>
        </div>
    ) : <Loading description="Finalizing your order" />
}

export default Success;