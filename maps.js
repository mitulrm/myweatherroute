const fetch = require("node-fetch");
//const request = require("request");
const googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyBuEgjDNa2KYTcaHpJqi-Sv82kvf4r3POM",
  Promise: Promise
});
//console.log("Hello");

function getWeather(Lat, Lng) {
  return (
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Lng}&units=metric&mode=json&APPID=3d835e76a19438d810f844383981b351`
    )
      .then(response => {
        return response.json();
      })

      //.then(response => console.log(`${Lat} ${Lng} ${response.main.temp}`))
      .catch(err => {
        console.log(err);
      })
  );
}
//getWeather(33.8162219, -117.9224731);

/*function getWeather(Lat, Lng) {
  var weather;
  request(
    {
      url: `http://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Lng}&units=metric&mode=json&APPID=3d835e76a19438d810f844383981b351`,
      json: true
    },
    (error, response, body, weather) => {
      weather = JSON.stringify(body);
      //console.log(weather);
    }
  );
  console.log(weather);
  return weather;
}
*/
function directions(fromLatLng, toLatLng) {
  return (
    googleMapsClient
      .directions({
        origin: fromLatLng,
        destination: toLatLng
      })
      .asPromise()
      .then(response => {
        var steps = [];
        response.json.routes[0].legs[0].steps.forEach(step => {
          //console.log(step.start_location.lat + " " + step.start_location.lng);
          promise = new Promise((resolve, reject) => {
            getWeather(step.start_location.lat, step.start_location.lng)
              .then(res => {
                step["weather"] = res;
                resolve(step);
              })
              .catch(error => reject(error));
          });
          steps.push(promise);
        });

        return Promise.all(steps)
          .then(steps => {
            response.json.routes[0].legs[0].steps = steps;
            //console.log(response.json.routes[0].legs[0].steps);
            //console.log(steps);
            return response;
          })
          .catch(err => {
            console.log(err);
          });
      })
      //.then(response => console.log(response.json.routes[0].legs[0].steps))
      .catch(err => {
        console.log(err);
      })
  );
}
/*
directions(
  { lat: 42.88644679999999, lng: -78.8783689 },
  { lat: 40.7127753, lng: -74.0059728 }
).then(dir => console.log(dir.json.routes[0].legs[0].steps));
*/
//console.log(resp.routes.legs.steps.end_location);
/*
googleMapsClient
  .geocode({ address: "1600 Amphitheatre Parkway, Mountain View, CA" })
  .asPromise()
  .then(response => {
    console.log(response.json.results);
  })
  .catch(err => {
    console.log(err);
  });
*/
exports.directions = directions;
