import {
  /*  withScriptjs,*/

  Marker,
  InfoWindow
} from "react-google-maps";

import React, { Component } from "react";
class MarkerWithInfo extends Component {
  state = {
    isOpen: false
  };

  onToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Marker
        key={this.props.position.lat}
        position={this.props.position}
        weather={this.props.weather}
        onMouseOver={this.onToggleOpen}
        onMouseOut={this.onToggleOpen}
      >
        {this.state.isOpen && (
          <InfoWindow onCloseClick={this.onToggleOpen}>
            <div>
              {this.props.address}
              {this.props.weather}
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default MarkerWithInfo;
