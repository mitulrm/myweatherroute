import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class InputBar extends Component {
  state = {
    From: "",
    To: ""
  };
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline my-2 my-lg-0">
          <input
            id="fromInput"
            className="form-control mr-sm-2"
            type="from"
            placeholder="From"
            aria-label="From"
          />
          <input
            id="toInput"
            className="form-control mr-sm-2"
            type="To"
            placeholder="To"
            aria-label="To"
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
