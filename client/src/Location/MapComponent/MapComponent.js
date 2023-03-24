import {Component} from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import './MapComponent.css'
import React from 'react';
import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}, // restuarant location information for the info window
    
            mapCenter: {
                lat: 43.741773,
                lng: -79.345132
            },

            address: '',  // used for autocomplete address input
            markers: props.locations,
            infoWindowLocation: {
                lat: 43.711920500000005,
                lng: -79.3847216
            },
            zoom: 10,
            selectedDistance: 0,  // the distance between userLocation and resturant locations
            userLocation: {},  // the selected location the user provides
            sideBarRefs: props.refs
        }
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            infoWindowLocation: {lat: (marker.position).lat()+ 0.0018, lng: (marker.position).lng()},
            mapCenter: {lat: (marker.position).lat()+ 0.0018, lng: (marker.position).lng()},
            zoom: 13,
        });
        if (this.state.userLocation.position) {
            this.setState({selectedDistance: 
                parseFloat(this.calcDistance(this.state.userLocation.position, {lat: marker.position.lat(), lng: marker.position.lng()})).toFixed(1)
            })
        }
    }
    
    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            })
        }
    };

    handleChange = address => {
        this.setState({ address });
    };

    setMap = (location) => {
        this.setState({
            userLocation: {name: location.name, position: location.position, address: location.address},
            selectedDistance: location.distance,
            showingInfoWindow: true,
            infoWindowLocation: {lat: location.position.lat + 0.0018, lng: location.position.lng},
            mapCenter: location.position,
            zoom: 13,
            selectedPlace: {name: location.name, phone: location.phone, address: location.address}
        });
    }
     
    handleSelect = (address) => {
        this.setState({ address });
        geocodeByAddress(address)
            .then(results => 
                getLatLng(results[0]) 
            )
            .then((latLng) => {
                this.setByLatLng(latLng);
            })
            .catch(error => console.error('Error', error));
    };

    getCurrentPosition = () => {
        const geolocation = navigator.geolocation;
        geolocation.getCurrentPosition(position => {
            this.setByLatLng({lat: position.coords.latitude, lng: position.coords.longitude})
        },
        () => {
            console.log(new Error("Permission denied"));
        }
        );
    };

    setByLatLng = (latLng) => {
                let locationDistances = [];
                // sort locations by distances
                this.props.locations.forEach((location) => {
                    location.distance = parseFloat(this.calcDistance(location.position, latLng)).toFixed(1);
                    locationDistances.push(location)
                })
                locationDistances.sort((a, b) => {return a.distance-b.distance});

                // set map center to closest location
                this.setMap(locationDistances[0]);
                this.props.setLocation(locationDistances);

                // add onclick event for location info refs
                this.state.sideBarRefs.current.map((ref) => (
                    ref.onclick= () => {
                        this.setMap(JSON.parse(ref.getAttribute('props')).location)
                    }
                ))
    }

    calcDistance = (coord1, coord2) => {
        var R = 6371; // km
        var dLat = (coord2.lat-coord1.lat) * Math.PI / 180;;
        var dLon = (coord2.lng-coord1.lng)* Math.PI / 180;;
        var lat1 = (coord1.lat)* Math.PI / 180;;
        var lat2 = (coord2.lat)* Math.PI / 180;;

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    render() {
        return(
            <React.Fragment>
            <div className="google-map">
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className='location-search-bar'>
                        <div>
                            <input
                            {...getInputProps({
                                placeholder: 'Enter your Location ...',
                                className: 'location-search-input',
                            })}
                            />
                            { suggestions.length>0 && <div className="autocomplete-dropdown-container">
                                {suggestions.map((suggestion, i) => {
                                    const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer', fontSize: "20px" }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer', fontSize: "20px" };
                                    return (
                                    <div key={i}
                                        {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                    );
                                })}
                            </div>
                        }</div>
                        <IconButton className="my-location-button" key="my-location" onClick={this.getCurrentPosition}>
                            <MyLocationIcon fontSize="large" sx={{color: "black", borderRadius:"100%", backgroundColor: "white"}} key="location-icon"></MyLocationIcon>
                        </IconButton>
                    </div>
                    )}
                </PlacesAutocomplete>
                <Map
                    google= {this.props.google}
                    style = {{height: "100%", width: "100%"}}
                    zoom = {this.state.zoom}
                    initialCenter = {{
                        lat: this.state.mapCenter.lat,
                        lng: this.state.mapCenter.lng
                    }}
                    center = {{
                        lat: this.state.mapCenter.lat,
                        lng: this.state.mapCenter.lng
                    }}
                    onClick = {this.onMapClicked}
                    >
                        {this.state.markers.map((location, i) => (
                            
                            <Marker 
                            key={i}
                            position={location.position} 
                            onClick={this.onMarkerClick} 
                            name={location.name}
                            phone={location.phone}
                            address={location.address}>
                            </Marker>
                        ))}
                        <InfoWindow
                            position={this.state.infoWindowLocation}
                            visible={this.state.showingInfoWindow}>
                            <div>
                                <h1>{this.state.selectedPlace.name}</h1>
                                <h3>{this.state.selectedPlace.address}</h3>
                                 {this.state.selectedDistance !== 0 && <h4>{this.state.selectedDistance} km away</h4>}
                                 <h4>Tel: {this.state.selectedPlace.phone}</h4>
                            </div>
                        </InfoWindow>
                </Map>
            </div>
            </React.Fragment>
        )
    }
}
 
export default GoogleApiWrapper({
    apiKey:"A_PRIVATE_KEY",
})(MapComponent)