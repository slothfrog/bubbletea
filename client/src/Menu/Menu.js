import MenuSection from "./MenuSection/MenuSection";
import { useQuery } from "@apollo/react-hooks";
import { getCategories } from "../api/MenuAPI";
import './Menu.css'

const Menu = () => {
    const {loading: categoryLoading, data: categoryData } = useQuery(getCategories);

    return (<div> 
    {!categoryLoading && <div className="menu">
        {(categoryData.categories).map((category, i) => (
            <MenuSection key={i} category={category}/>
        ))}
    </div>}
    </div>);
}
 
export default Menu;