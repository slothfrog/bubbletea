import './DrinkSection.css'
import * as React from 'react';
import ItemDetails from './ItemDetails/ItemDetails';


const DrinkSection = (props) => {
    const drinks = props.drinks;
    
    return ( 
        <div className="drinks">
            {(drinks.products).map((drink, i) => (
                <ItemDetails key={i} drink={drink}></ItemDetails>
            ))}
        </div>
    );
}
 
export default DrinkSection;