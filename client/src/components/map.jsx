import React, { Component } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { compose, withProps } from "recompose";

const MyMap = compose(
  withProps({
    googleMapURL: "asd",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `530px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(({ forwardedRef, ...props }) => (
  <GoogleMap
    ref={forwardedRef}
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.markers.map(marker => {
      return <Marker position={{ lat: marker.lat, lng: marker.lng }} />;
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
