const express = require("express");
const maps = require("./maps");
const db = require("./db");
const app = express();
const port = 4000;
require("dotenv").config();
const fetch = require("node-fetch");
//const request = require("request");
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAP_API_KEY,
  Promise: Promise
});

function directions(fromLatLng, toLatLng) {
  googleMapsClient
    .directions({
      origin: fromLatLng,
      destination: toLatLng
    })
    .asPromise()
    .then(response => console.log(response.json.routes[0].legs[0].steps))
    .catch(err => {
      console.log(err);
    });
}

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (request, response) => {
  response.send(`Hello from Express! `);
});

app.get("/directions/", (request, response) => {
  const fromLatLng = { lat: request.query.fromLat, lng: request.query.fromLng };
  const toLatLng = { lat: request.query.toLat, lng: request.query.toLng };
  /*maps
    .directions(fromLatLng, toLatLng)
    .then(directions => response.send(directions))
    .catch(err => {
      console.log(err);
    });
*/
  db.getDirections(fromLatLng, toLatLng)
    .then(directions => response.send(directions))
    .catch(err => console.error(err));
  //response.send(`Hello from Express with params! ${request.query.fromLat}`);
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
