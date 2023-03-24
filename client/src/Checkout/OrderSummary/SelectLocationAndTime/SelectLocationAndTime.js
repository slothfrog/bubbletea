import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './SelectLocationAndTime.css';

const SelectLocationAndTime = (props) => {
    function getDrinkPrices(drinks) {
        let result = []
        for(let i=0; i<drinks.length; i++){
            const size = drinks[i].customizations.size
            const quantity = drinks[i].quantity
            const sizesAndPricesList = drinks[i].product.customizations.sizes
            for(let j=0; j<sizesAndPricesList.length; j++){
                if(sizesAndPricesList[j].value===size)
                    result.push(sizesAndPricesList[j].price*quantity)
            }
        }
        return result;
    }

    function getSumToppingPrices(drinks) {
        let result = []
        for(let i=0; i<drinks.length; i++){
            const toppings = drinks[i].toppings
            const quantity = drinks[i].quantity
            let priceSum = 0
            for(let j=0; j<toppings.length; j++){
                priceSum+=toppings[j].price*quantity
            }
            result.push(priceSum)
        }
        return result;
    }

    const { drinks, locations, dateTime, handleTimeChange, selectedLocation, handleLocationChange } = props
    const drinkPrices = getDrinkPrices(drinks)
    const totalToppingPrices = getSumToppingPrices(drinks)
    const subtotal = drinkPrices.reduce((acc, price) => acc + price, 0) + totalToppingPrices.reduce((acc, price) => acc + price, 0);
    const tax = (subtotal*0.13).toFixed(2)
    const total = (subtotal*1.13).toFixed(2)
    const current_time = new Date();
    const post_10_min = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate(), current_time.getHours(), current_time.getMinutes()+10)

    return (             
        <div className='order-summary-card'>
            <div className='order-summary-time-selector location'>
                <div className='order-summary-label'>
                    Select Location
                </div>
                <FormControl required sx={{width: "90%"}}>
                    <Select value={selectedLocation.name} id="pickup-location" name="location" onChange={handleLocationChange}>
                        {locations.map((location) => (
                            <MenuItem value={location.name} key={location._id}>{location.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='order-summary-time-selector'>
                <div className='order-summary-label'>
                    Select pickup time
                </div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                    disablePast
                    minDateTime={post_10_min}
                    value={dateTime}
                    onChange={handleTimeChange}
                    renderInput={(params) => 
                        <TextField sx={{
                            backgroundColor: "white", 
                            width: "90%",
                            '& .MuiOutlinedInput-input': {
                                textAlign: 'center',
                              },
                        }} {...params} />}
                    onError={() => props.setIsInvalidTime(true)}
                    />
                </LocalizationProvider>
            </div>
            <div className='order-summary-drink' >
                {
                drinks.map((drink, ind) => (
                    <div className='order-summary-drink-item' key={"odr-smry"+drink._id}>
                        <div className='order-summary-drink-name'>{drink.product.name + " x" + drink.quantity}</div>
                        <div className='order-summary-drink-price'>{" $"+(drinkPrices[ind]+totalToppingPrices[ind]).toFixed(2)}</div>
                    </div>
                ))
                }
            </div>
            <div className='order-summary-total' >
                <div className='order-summary-tax'>{"tax: $" + tax}</div>
                Total: $
                {total}
            </div>
        </div>
    )
}

export default SelectLocationAndTime;