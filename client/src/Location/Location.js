import MapComponent from './MapComponent/MapComponent'
import './Location.css'
import LocationInfo from './LocationInfo';
import { useState, useRef } from 'react';
import { getLocations } from '../api/LocationAPI'
import { useQuery } from '@apollo/react-hooks';

const Location = (props) => {
    const [userLocation, setUserLocation] = useState(null)
    const {loading: locationLoading, data: locationData } = useQuery(getLocations)
    const refs = useRef([]);
    refs.current = [];

    const addToRefs = (element) => {
        if (element && !refs.current.includes(element)) {
            refs.current.push(element)
        }
    }

    const updateUserLocation = (location) => {
        setUserLocation(location);
    }
    if (props) {
        return ( 
            <div className="location-background">
                <div className="location-inputs">
                    <h2 className="location-header">Find Locations Near You</h2>
                    {userLocation && userLocation.map((location, i) => (
                        <LocationInfo ref={addToRefs} key={i} location={location}></LocationInfo>
                    ))}
                </div>
                {!locationLoading && <div className="map-container">
                    <MapComponent setLocation={updateUserLocation} locations={locationData.locations} refs={refs}></MapComponent>
                </div>}
            </div> 
        );
    }
}
 
export default Location;



