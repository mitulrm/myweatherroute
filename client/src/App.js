import React, { Component } from "react";
import "./App.css";
import InputBar from "./components/inputbar";
import MyMap from "./components/map";
//import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapWithRef = React.forwardRef(({ ...props }, ref) => {
  console.log(`in forward ref ${props.isMarkerShown}`);
  return <MyMap {...props} forwardedRef={ref} />;
});

class App extends Component {
  state = {
    MyMap: null,
    map: 1,
    markers: [],
    isMarkerShown: true
  };
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  onInputChange = latLng => {
    console.log("PanTo ", latLng);
    this.map.current.panTo(latLng);
  };

  onSubmit = (fromLatLng, toLatLng) => {
    this.setState(prevState => ({
      markers: [...prevState.markers, fromLatLng]
    }));
    this.setState(prevState => ({
      markers: [...prevState.markers, toLatLng]
    }));
    this.setState({ isMarkerShown: true });
    this.state.markers.map(marker => console.log(marker.lat, marker.lng));
    console.log(this.state.isMarkerShown);
  };

  renderDirections = () => {
    const DirectionsService = new google.maps.DirectionsService();
  };

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <InputBar
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
          />
          <MapWithRef
            ref={this.map}
            markers={this.state.markers}
            isMarkerShown={this.isMarkerShown}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
