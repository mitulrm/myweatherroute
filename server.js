/*Main Server script. 
It creates Express server and listens for GET request from frontend, 
fetches requested directions and weather and sends response to frontend with all data.*/

const express = require("express");
const db = require("./db");
const app = express();
const port = 4000;
require("dotenv").config();
const maps = require("./maps");

/*Middleware function which sets necessary header information in response. */
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (request, response) => {
  response.send(`Hello from Express! `);
});

/*Listens for GET requests from directions route. 
If value of USE_DATABASE variable in env file is 1, it fetches data from database, 
else it will fetch data directly from Map and Weather API. */

app.get("/directions/", (request, response) => {
  const fromLatLng = { lat: request.query.fromLat, lng: request.query.fromLng };
  const toLatLng = { lat: request.query.toLat, lng: request.query.toLng };
  if (process.env.USE_DATABASE === 1) {
    db.getDirections(fromLatLng, toLatLng)
      .then(directions => response.send(directions))
      .catch(err => console.error(err));
  } else {
    maps
      .directions(fromLatLng, toLatLng)
      .then(directions => response.send(directions))
      .catch(err => {
        console.error(err);
      });
  }
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
