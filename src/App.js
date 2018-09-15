import React, { Component } from "react";
import "./App.css";
import InputBar from "./components/inputbar";
import MyMap from "./components/map";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapWithRef = React.forwardRef(({ ...props }, ref) => (
  <MyMap {...props} forwardedRef={ref} />
));

class App extends Component {
  state = {
    MyMap: null,
    map: 1
  };
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  onInputChange = latLng => {
    console.log("PanTo ", latLng);
    this.map.current.panTo(latLng);
  };

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <InputBar onInputChange={this.onInputChange} />
          <MapWithRef ref={this.map} isMarkerShown />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
