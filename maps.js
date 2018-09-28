/*Main script which calls Google Maps and weather APIs to fetch data.*/

const fetch = require("node-fetch");
require("dotenv").config();

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAP_API_KEY,
  Promise: Promise
});

/*Fetch weather data for given Latitude Longitude location using openweather API */
function getWeather(Lat, Lng) {
  return fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Lng}&units=metric&mode=json&APPID=${
      process.env.WEATHER_API_KEY
    }`
  )
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.error(err);
    });
}

/*This function calls Google Maps API for directions, 
also embeds Weather information in direction JSON object*/
function directions(fromLatLng, toLatLng) {
  return googleMapsClient
    .directions({
      origin: fromLatLng,
      destination: toLatLng
    })
    .asPromise()
    .then(response => {
      var steps = [];
      response.json.routes[0].legs[0].steps.forEach(step => {
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
          return response;
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
}

exports.directions = directions;
