/*global google*/
import React, { Component } from "react";
import "./App.css";
import InputBar from "./components/inputbar";
import MyMap from "./components/map";
/*import {
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer
} from "react-google-maps";
*/
const MapWithRef = React.forwardRef(({ ...props }, ref) => {
  return <MyMap {...props} forwardedRef={ref} />;
});

class App extends Component {
  state = {
    MyMap: null,
    map: 1,
    markers: [],
    directions: {},
    isDirection: false
  };
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  asLatLng = latLngObject => {
    return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
  };

  asPath = encodedPolyObject => {
    return google.maps.geometry.encoding.decodePath(encodedPolyObject.points);
  };

  asBounds = boundsObject => {
    return new google.maps.LatLngBounds(
      this.asLatLng(boundsObject.southwest),
      this.asLatLng(boundsObject.northeast)
    );
  };

  typecastRoutes = routes => {
    routes.forEach(route => {
      route.bounds = this.asBounds(route.bounds);
      // I don't think `overview_path` is used but it exists on the
      // response of DirectionsService.route()
      route.overview_path = this.asPath(route.overview_polyline);

      route.legs.forEach(leg => {
        leg.start_location = this.asLatLng(leg.start_location);
        leg.end_location = this.asLatLng(leg.end_location);

        leg.steps.forEach(step => {
          step.start_location = this.asLatLng(step.start_location);
          step.end_location = this.asLatLng(step.end_location);
          step.path = this.asPath(step.polyline);
        });
      });
    });
    return routes;
  };

  onInputChange = latLng => {
    console.log("PanTo ", latLng);

    this.map.current.panTo(latLng);
  };

  setMarkers = directions => {
    this.setState({ markers: [] });
    directions.routes[0].legs[0].steps.forEach(step => {
      const marker = {
        position: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng()
        },
        //address: step.start_address,
        weather: step.weather.main.temp
      };

      this.setState(prevState => ({
        markers: [...prevState.markers, marker]
      }));
    });
  };

  onSubmit = (fromLatLng, toLatLng) => {
    /*this.setState(prevState => ({
      markers: [fromLatLng, toLatLng]
    }));
    this.state.markers.map(marker => console.log(marker.lat, marker.lng));*/
    /*
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: fromLatLng,
        destination: toLatLng,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          
          this.setState({
            directions: result
          });
        }
      }
    );
*/

    var url = new URL("http://localhost:4000/directions");
    var params = {
      fromLat: fromLatLng.lat,
      fromLng: fromLatLng.lng,
      toLat: toLatLng.lat,
      toLng: toLatLng.lng
    };
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8"
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
      //body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(response => response.json())
      .then(response => {
        //console.log(directions.json.routes[0]);
        this.setState({
          directions: {
            routes: this.typecastRoutes(response.json.routes),
            request: {
              origin: fromLatLng,
              destination: toLatLng,
              travelMode: "DRIVING"
            }
          }
        });
        this.setState({ isDirection: true });
        this.setMarkers(response.json);
        console.log(response.json.geocoded_waypoints);
      });
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
            directions={this.state.directions}
            isDirection={this.state.isDirection}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
