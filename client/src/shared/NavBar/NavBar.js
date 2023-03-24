import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import './NavBar.css'

const NavBar = (props) => {
    const pages = ['Menu', 'Contact Us', 'Locations'];
    const urlPage = ['/', '/contact-us', '/locations'];

    return ( 
        <AppBar position="fixed" sx={{backgroundColor: "#a6c875"}}>
            <Container maxWidth="xl" sx={{backgroundColor:"#a6c875"}}>
                <Toolbar disableGutters>
               <div className="logo"></div>
               
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page, i) => (
                        <Link key={i} to={urlPage[i]}>
                            <button
                                className="nav-button"
                                key={page}
                                id={"nav-bar-" + page}
                            >
                                {page}
                            
                            </button>
                        </Link>
                    ))}
                </Box>

                <Box>
                    {props.error && <Link to='sign-in'>
                        <button className="nav-button">Sign-In</button>
                    </Link>}
                    {!props.load && props.user && !props.error &&<Link to='sign-in'>
                        <button className="nav-button" onClick={props.onLogout}>Logout</button>
                    </Link>}
                    <Link to="checkout">
                    <IconButton key="cart">
                        <ShoppingCartIcon fontSize="large" sx={{color: "black"}} key="cart-icon"></ShoppingCartIcon>
                    </IconButton>
                    </Link>
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
 
export default NavBar;