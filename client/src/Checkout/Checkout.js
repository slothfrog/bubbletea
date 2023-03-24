import { useEffect, useState } from 'react';
import './Checkout.css'
import DrinkSummary from './DrinkSummary/DrinkSummary';
import OrderSummary from './OrderSummary/OrderSummary';
import NoItemFound from './InfoPage/NoItemFound/NoItemFound';

import { getOrders as getOrdersApi } from "../api/CheckoutAPI";
import { getLocations as getLocationssApi } from "../api/LocationAPI";
import { useQuery } from '@apollo/react-hooks';
import Loading from '../shared/Loading/Loading';

const Checkout = (props) => {
    const isAuth = props.user
    const { loading, error, data, refetch } = useQuery(getOrdersApi)
    const { loading:loadingLocations, error:locationsError, data:locationData } = useQuery(getLocationssApi)
    const [update, setUpdate] = useState(true)
    const [isRedirecting, setIsRedirecting] = useState(false)

    useEffect(() => {
        if(update) {
            refetch()
            setUpdate(false)
        }
    }, [refetch, update])
    if(isRedirecting) return <Loading description="Redirecting to PayPal" />
    if(!isAuth) return <NoItemFound />
    if(!loading&!error&!loadingLocations&!locationsError) {
        let order = data.orders[0]
        if(!order || data.orders.length<=0) return <NoItemFound />
        let drinks = order.items
        if(drinks.length<=0) return <NoItemFound />
        return ( 
            <div>
                <div className='checkout-summary'>
                    <DrinkSummary drinks={drinks} orderId={order._id} updateOrders={setUpdate} />
                    <OrderSummary drinks={drinks} orderId={order._id} updateOrders={setUpdate} locations={locationData.locations} setIsRedirecting={setIsRedirecting} />
                </div>
            </div>
    )
    }
    return null
}

export default Checkout;