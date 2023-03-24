import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ItemAmount.css'

const ItemAmount = (props) => {
    return (
            <div className='item-amount'>
                <RemoveIcon sx={{marginLeft: 1, fontSize: 20}} onClick={props.removeItem}/>
                <div className='item-amount-number'>
                    {props.amount}
                </div>
                <AddIcon sx={{marginRight: 1, fontSize: 20}} onClick={props.addItem}/>
            </div>
    )
}

export default ItemAmount;