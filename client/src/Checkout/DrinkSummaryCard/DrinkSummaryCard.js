import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './DrinkSummaryCard.css'
import { useEffect, useState } from 'react';
import ItemAmount from '../../shared/ItemAmount/ItemAmount';

import { modifyOrderItem as modifyOrderItemApi, deleteOrderItem as deleteOrderItemApi } from '../../api/CheckoutAPI'
import { useMutation } from '@apollo/client';
import defaultDrinkImage from '../../shared/media/default_drink.png'

const DrinkSummaryCard = (props) => {
    const [modifyOrderItem, { data: modifyData, loading:modifyLoading, error:modifyError }] = useMutation(modifyOrderItemApi);
    const [deleteOrderItem, { data:deleteData, loading:deleteLoading, error:deleteError }] = useMutation(deleteOrderItemApi);
    const drink = props.drink
    const orderId = props.orderId
    const size = drink.customizations.size
    const sugarLevel = drink.customizations.sugarLevel
    const iceLevel = drink.customizations.iceLevel
    const price = drink.product.customizations.sizes.filter((s) => s.value===size)[0].price
    const name = drink.product.name
    const quantity = drink.quantity
    const image = drink.product.hasImage ? process.env.REACT_APP_SERVER_URL + "/rest/upload/product/" + drink.product._id : defaultDrinkImage

    const toppingIds= function(toppings){
        let result=[]
        for(let i=0; i<toppings.length; i++){
            result.push(toppings[i]._id)
        }
        return result
    }(drink.toppings)

    const [numOfDrinks, setNumOfDrinks] = useState(parseInt(quantity))
    const addDrink = () => {
        modifyOrderItem({ variables: { orderId, quantity:numOfDrinks+1, productId: drink.product._id, size, iceLevel, sugarLevel, toppings:toppingIds } });
        props.updateOrders(true)
    }
    const removeDrink = () => {
        if(numOfDrinks===1){
            deleteOrderItem({ variables: { orderItemId: drink._id}})
            props.updateOrders(true)
        } else {
            modifyOrderItem({ variables: { orderId, quantity:numOfDrinks-1, productId: drink.product._id, size, iceLevel, sugarLevel, toppings:toppingIds } });
            props.updateOrders(true)
        }
    }

    useEffect(() => {
        if(!modifyLoading&&modifyData&&!modifyError){
            setNumOfDrinks(modifyData.createOrderItem.quantity)
        }
      }, [modifyData, modifyLoading, modifyError])

      useEffect(() => {
          if(!deleteLoading&&deleteData&&!deleteError){
              setNumOfDrinks(0)
          }
        }, [deleteData, deleteLoading, deleteError])

    if(!numOfDrinks) return null;
    return ( 
        <Card sx={{ boxShadow: "0px -2px 15px 7px #56893c7d" }} className='root-card'>
            <CardContent>
                <div className='drink'>
                    <img className="thumbnail" src={image} alt="drink"></img>
                    <div className="name">
                        {name}
                    </div>
                    <div className="price">
                        {"$"+price}
                    </div>
                </div>
                <div className="details">
                    <div>
                        {size}
                    </div>
                    <div>
                        {sugarLevel + "% sugar"}
                    </div>
                    <div>
                        {iceLevel + " ice"}
                    </div>
                    <div>
                        {drink.toppings.map((topping, idx) => {
                            return(
                            <div className="parent" key={topping.name+toString(idx)}>
                                <div className='topping'>{topping.name}<div className='price'>{" +$" + topping.price}</div></div>
                            </div>
                        )})}
                    </div>
                </div>
                <ItemAmount amount={numOfDrinks} addItem={addDrink} removeItem={removeDrink} />
            </CardContent>
        </Card>
    )
}

export default DrinkSummaryCard;