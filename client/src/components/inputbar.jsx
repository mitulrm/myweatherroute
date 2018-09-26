import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  /*PlacesAutocomplete,*/ geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import AutoComplete from "./autocomplete";
//import MyMap from "./map";

class InputBar extends Component {
  state = {
    from: "",
    to: "",
    fromLatLnd: {},
    toLatLng: {}
  };

  onChange = (type, value) => {
    if (type === "from") {
      this.setState({ from: value });
      console.log("From change:" + this.state.from);
    } else {
      this.setState({ to: value });
      console.log("To changed:" + this.state.to);
    }
  };

  onSelect = (type, location) => {
    console.log("Selected location:" + location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        if (type === "from") {
          this.setState({ from: location });
          this.setState({ fromLatLng: latLng });
        } else {
          this.setState({ to: location });
          this.setState({ toLatLng: latLng });
        }
        return latLng;
      })
      .then(latLng => this.props.onInputChange(latLng))
      .catch(error => console.error("Error", error));
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.fromLatLng, this.state.toLatLng);
  };

  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <AutoComplete
          type={"from"}
          onChange={this.onChange}
          onSelect={this.onSelect}
          location={this.state.from}
        />
        <AutoComplete
          type={"to"}
          onChange={this.onChange}
          onSelect={this.onSelect}
          location={this.state.to}
        />
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          onClick={this.onSubmit}
        >
          Go !
        </button>
      </nav>
    );
  }
}

export default InputBar;
