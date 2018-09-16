import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import AutoComplete from "./autocomplete";
import MyMap from "./map";

class InputBar extends Component {
  state = {
    from: "",
    to: ""
  };
  constructor(props) {
    super(props);
    this.state = { from: "", to: "" };
  }

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
      .then(latLng => this.props.onInputChange(latLng))
      .catch(error => console.error("Error", error));
  };

  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline my-2 my-lg-0">
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
            type="submit"
          >
            Go!
          </button>
        </form>
      </nav>
    );
  }
}

export default InputBar;
