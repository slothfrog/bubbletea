import './Location.css'
import { forwardRef } from 'react';

const LocationInfo = forwardRef((props, ref) => {
    return ( 
        <div ref={ref} props={JSON.stringify(props)} className="location-info">
            <h2>{props.location.name}</h2>
            <h4 className="location-info-address">{props.location.address}</h4>
            <h4>Tel: {props.location.phone}</h4>
            <div>{props.location.distance} km away</div>
        </div>
     );
});
 
export default LocationInfo;