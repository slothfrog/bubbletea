import * as React from 'react';
import Card from '@mui/material/Card';
import DialogActions from '@mui/material/DialogActions'
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog'
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import ItemAmount from '../../../../shared/ItemAmount/ItemAmount';
import './ItemDetails.css'
import DEFAULT_IMAGE from '../../../../shared/media/default_drink.png'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { addOrderItem } from '../../../../api/MenuAPI'
import { createOrder, getOrders } from '../../../../api/CheckoutAPI';
import { getIsAuthenticated} from '../../../../api/LoginAPI';
import { useNavigate } from 'react-router-dom';

const ItemDetails = (props) => {
    const navigate = useNavigate();
    const { data: userData} = useQuery(getIsAuthenticated, { errorPolicy: 'ignore' });
    const { data: orders, refetch} = useQuery(getOrders);
    const [drink] = React.useState(props.drink);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const [toppingName, setToppingName] = React.useState([]);
    const [toppingIds, setToppingIds] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const [size, setSize] = React.useState(drink.customizations.sizes[0].value);
    const [ice, setIce] = React.useState(drink.customizations.iceLevels[0]); 
    const [sugar, setSugar] = React.useState(drink.customizations.sugarLevels[0]);

    const [price, setPrice] = React.useState(drink.customizations.sizes[0].price)
    const [toppingPrice, setToppingPrice] = React.useState(0);

    const [quantity, setQuantity] = React.useState(1);
    
    const toppingSelector = React.useRef()

    const [totalPrice, setTotalPrice] = React.useState(0);

    const [addItem] = useMutation(addOrderItem);
    const [newOrder] = useMutation(createOrder);

    React.useEffect(() => {
        setTotalPrice((quantity*(parseFloat(price)+parseFloat(toppingPrice))).toFixed(2));
    
    }, [price, toppingPrice, quantity]);

    React.useEffect(() => {
        refetch();
    }, [refetch]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSize(drink.customizations.sizes[0].value);
        setIce(drink.customizations.iceLevels[0]);
        setSugar(drink.customizations.sugarLevels[0]);
        setQuantity(1);
        setToppingPrice(0);
        setPrice(drink.customizations.sizes[0].price);
        setToppingName([]);
        setToppingIds([]);
    };

    const compareDrinks = (prevOrder) => {
        return(
            JSON.stringify({
                productId: props.drink._id, 
                size: size, 
                ice: ice,
                sugar: sugar,
                toppings: toppingIds._id ? toppingIds._id: []
            })===
            JSON.stringify({
                productId: prevOrder.product._id, 
                size: prevOrder.customizations.size, 
                ice: prevOrder.customizations.iceLevel,
                sugar: prevOrder.customizations.sugarLevel,
                toppings: prevOrder.toppings
            })
        )
    }

    const handleAddItem = () => {
        if(orders === undefined) {
            navigate('sign-in')
        }

        else if(orders.orders.length === 0){
            newOrder().then(
                (result)=> {
                    addItem(
                        {variables: {
                            quantity: quantity, 
                            orderId: result.data.createOrder._id, 
                            productId: props.drink._id, 
                            size: size, 
                            ice: ice,
                            sugar: sugar,
                            toppings: toppingIds
                        }})
                }
            );
        }
        else {
            let prevOrderItemQuantity = 0;
            orders.orders[0].items.forEach((item, i) => {
                if(compareDrinks(item)) {
                    prevOrderItemQuantity = item.quantity
                }
            })
            addItem(
                {variables: {
                    quantity: quantity + prevOrderItemQuantity, 
                    orderId: orders.orders[0]._id, 
                    productId: props.drink._id, 
                    size: size, 
                    ice: ice,
                    sugar: sugar,
                    toppings: toppingIds
                }
            });
        }

        handleClose();
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleSelectItem = (event) => {
        switch (event.target.name) {
            case 'size': 
                setSize(event.target.value);
                break;
            case 'ice': 
                setIce(event.target.value);
                break;
            case 'sugar': 
                setSugar(event.target.value);
                break;
            default:
                break;
        }
    }

    const handleMultiChange = (event) => {
        const {
          target: { value },
        } = event;
        setToppingName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handlePrice = (event) => {
        setPrice(event.target.getAttribute('price'))
    }

    const updateTopping = (event) => {
        let input = event.target.closest('.topping-selection-input');
        let sign = input.getAttribute('aria-selected') !=="true" ? 1 : -1

        setToppingPrice((parseFloat(toppingPrice) + sign*parseFloat(input.getAttribute('price'))).toFixed(2))
        if(sign === -1) {
            setToppingIds(toppingIds.filter((id) => id !== input.id));
        }
        else {
            setToppingIds([...toppingIds, input.id]);
        }
    }

    const getToppingSelected = (selected) => {
        if (selected.length === 1) {
            return selected.length + " Topping Selected";
        }
        return selected.length + " Toppings Selected";
    }

    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          },
        },
      };

    return ( 
        <div className="drink-item" key={props.drink.id}>
            <img className='drink-image' src={props.drink.hasImage ? process.env.REACT_APP_SERVER_URL + "/rest/upload/product/" + props.drink._id : DEFAULT_IMAGE} onClick={handleClickOpen} alt="drink_img"/>
            <h2 className='drink-name' onClick={handleClickOpen}>{props.drink.name} </h2>
            {<Dialog open={open} onClose={handleClose}  maxWidth="md" scroll="body">
                    
                    <Card className="item-details" sx={{ maxWidth: 1000, minWidth: "800px"}}>
                        <Box className="dialog-header" sx={{
                            height:"200px", 
                            backgroundColor: "#D5ECB4", 
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center"}}>
                            <img className="drink-image-details" src={props.drink.hasImage ? process.env.REACT_APP_SERVER_URL + "/rest/upload/product/" + props.drink._id : DEFAULT_IMAGE} alt="drink_img"/>

                            <h2>{props.drink.name}</h2>
                        </Box>
                        <Box className="options" sx={{ display: "flex", justifyContent: "space-between"}}>
                                <Box className= "size-options">
                                    <h3 className="option-header">Size Options</h3>
                                    <FormControl fullWidth required sx={{marginBottom: "50px"}}>
                                    <InputLabel id="drink-size-select-label" >Drink Size</InputLabel>
                                        <Select label="Drink Size" id="size-select" sx={{textTransform: "capitalize"}} labelId="drink-size-select-label" name="size" onChange={handleSelectItem} defaultValue={drink.customizations.sizes[0].value}>
                                            {drink.customizations.sizes.map((size, i) =>(
                                                <MenuItem onClick={(event) => handlePrice(event)} sx={{textTransform: "capitalize"}} key={i} value={size.value} price={size.price}>{size.value}</MenuItem>
                                            ))}                                            
                                        </Select>
                                    </FormControl>

                                    <Box className="drink-info" sx={{border: "2px solid black", maxWidth:300}}>
                                        <div className="info">
                                            <h3 className="info-label">Size: </h3>
                                            <h3 className="user-select"> {size}</h3>
                                        </div>
                                        <div className="info">
                                            <h3 className="info-label">Sugar Level: </h3>
                                            <h3 className="user-select"> {parseInt(sugar)}% </h3>
                                        </div>
                                        <div className="info">
                                            <h3 className="info-label">Ice Amount: </h3>
                                            <h3 className="user-select"> {ice} </h3>
                                        </div>
                                        <div className="info">
                                            <h3 className="info-label">Toppings: </h3>
                                            <h3 className="user-select"> {toppingName.length===0 ? "None" : toppingName.join(', ')} </h3>
                                        </div>
                                    </Box>
                                </Box>
                                <Box className="customizations" sx={{maxWidth:300}}>
                                    <h3 className="option-header">Customizations</h3>
                                    <FormControl required sx={{width: 300}}>
                                        <InputLabel id="sugar-level-select-label" >Sugar Level</InputLabel>
                                        <Select id="sugar-level" label="Sugar Level" sx={{textTransform: "capitalize"}} labelId="sugar-level-select-label" name="sugar" onChange={handleSelectItem} defaultValue={drink.customizations.sugarLevels[0]}>
                                            {drink.customizations.sugarLevels.map((sugar, i) =>(
                                                <MenuItem key={i} value={parseInt(sugar)}>{parseInt(sugar)+ "%"}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{marginTop: "10px", width: 300}} required>                                         
                                        <InputLabel id="ice-level-select-label" >Ice Amount</InputLabel>
                                        <Select id="ice-level" label="Ice Amount" sx={{textTransform: "capitalize"}} labelId="ice-level-select-label" name="ice" onChange={handleSelectItem} defaultValue={drink.customizations.iceLevels[0]}>
                                            {drink.customizations.iceLevels.map((ice, i) =>(
                                                <MenuItem sx={{textTransform: "capitalize"}}key={i} value={ice}>{ice}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ marginTop: "10px", width: 300}}>
                                        <InputLabel id="topping-select-label">Toppings</InputLabel>
                                        <Select
                                        name="topping"
                                        labelId="topping-select-label"
                                        id="toppings"
                                        multiple
                                        value={toppingName}
                                        onChange={handleMultiChange}
                                        input={<OutlinedInput label="Toppings" />}
                                        renderValue={(selected) => getToppingSelected(selected)}
                                        MenuProps={MenuProps}
                                        price={toppingPrice}
                                        ref={toppingSelector}
                                        >
                                        {(drink.toppings).map((topping, i) => (
                                            <MenuItem className="topping-selection-input" key={topping.name} id={topping._id} value={topping.name} price={topping.price} onClick={(event) =>{updateTopping(event)}} >
                                            <Checkbox checked={toppingName.indexOf(topping.name) > -1} />
                                            <ListItemText primary={`${topping.name} (+$${topping.price})`} />
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                        </Box>
                        
                        <CardContent>
                            <DialogActions>
                            <div className="total">
                                <div className="quantity">
                                    Qty:
                                    <ItemAmount className="quantity-change" amount={quantity} addItem={incrementQuantity} removeItem={decrementQuantity}></ItemAmount>
                                </div>
                                <div className="confirm-add">
                                    <div className="drink-details-price">Total: ${totalPrice}</div>
                                        {userData && <Button 
                                        onClick={handleAddItem} 
                                        variant="contained" 
                                        sx={{backgroundColor:"#56893c"}}
                                        endIcon={<AddShoppingCartIcon/>}
                                        >Add to Order
                                        </Button>}
                                        {!userData && <Button 
                                        onClick={handleAddItem} 
                                        variant="contained" 
                                        sx={{backgroundColor:"#56893c"}}
                                        >Sign-In to Order
                                        </Button>}
                                </div>
                            </div>
                            </DialogActions>
                        </CardContent>
                    </Card>
                
            </Dialog>}
        </div>
    )
}

export default ItemDetails;