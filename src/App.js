import React, { Component } from "react";
import "./App.css";
import InputBar from "./components/inputbar";
import MyMap from "./components/map";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="App">
          <InputBar />
          <MyMap
            isMarkerShown
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `500px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
