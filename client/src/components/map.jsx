import React from "react";
import {
  /*  withScriptjs,*/
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";
import { compose, withProps } from "recompose";
import MarkerWithInfo from "./marker";
const MyMap = compose(
  withProps({
    googleMapURL: "",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `530px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  //  withScriptjs,
  withGoogleMap
  /*withStateHandlers(
    () => ({
      isWindowOpen: false,
      weather: ""
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen
      }),
      onMouseOver: ({ isOpen }) => updateWeather => ({
        weather: updateWeather,
        isOpen: !isOpen
      })
    }
  )*/
)(({ forwardedRef, ...props }) => (
  <GoogleMap
    ref={forwardedRef}
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isDirection && <DirectionsRenderer directions={props.directions} />}
    {props.markers.map(marker => {
      return (
        /*   <Marker
          key={marker.position.lat}
          position={marker.position}
          weather={marker.weather}
          onMouseOver={weather => props.onMouseOver(weather)}
          onMouseOut={props.onToggleOpen}
        >
          {props.isOpen && (
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <div>Info Window</div>
            </InfoWindow>
          )}
        </Marker>*/
        <MarkerWithInfo
          key={marker.position.lat}
          position={marker.position}
          weather={marker.weather}
          address={marker.address}
        />
      );
    })}
  </GoogleMap>
));

export default MyMap;

/*
(
  <Marker
    position={{ lat: -34.397, lng: 150.644 }}
    onClick={props.onMarkerClick}
  />
  )}*/

/*
  {props.markers.map((marker, i) => {
    return (
      <Marker lat={marker.lat} lng={marker.lng}>
        position=
        {{ lat: marker.lat, lng: marker.lng }}
      </Marker>
    );
  })}*/
