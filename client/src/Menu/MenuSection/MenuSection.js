import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DrinkSection from './DrinkSection/DrinkSection';
import { useQuery } from '@apollo/react-hooks';
import { getProducts} from '../../api/MenuAPI';
import './MenuSection.css'

const MenuSection = (props) => {
    const { loading: productLoading, data: productData } = useQuery(getProducts, {variables: {category: props.category._id}});
   
    return ( 
        <div className="menu-section">
            <React.Fragment>
                <CssBaseline />
                <div className='container'>
                    <Box sx={{ bgcolor: 'white', width:'100%' }}>
                        <Box className='section-title' sx={{ textAlign: 'left', paddingLeft: '20px', paddingTop:'20px' }}>
                            <h1 className='title'>{props.category.name}</h1>
                        </Box>
                        {!productLoading && <Box className='section-drinks'>
                            <DrinkSection drinks={productData}></DrinkSection>
                        </Box>}
                    </Box>
                </div>
            </React.Fragment>
        </div>
     );
}
 
export default MenuSection;