import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DrinkSummaryCard from '../DrinkSummaryCard/DrinkSummaryCard';
import './DrinkSummary.css'

const DrinkSummary = (props) => {
    const drinks = props.drinks
    return ( 
            <Card className='drink-summary-card'>
                <CardContent sx={{ alignItems: "center"}} className='drink-summary-card-content'>{
                drinks.map((drink) => (
                    <DrinkSummaryCard drink={drink} {...props} key={drink._id}></DrinkSummaryCard>
                ))
                }
                </CardContent>
            </Card>
    )
}

export default DrinkSummary;