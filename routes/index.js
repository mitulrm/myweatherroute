var express = require("express");
var router = express.Router();
/*var googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyBRUd4wScQw_9UJpRx3sR3EzAmU1T2vqUw",
  Promise: Promise
});

googleMapsClient
  .directions({
    origin: {
      lat: 33.8162219,
      lng: -117.9224731
    },
    destination: {
      lat: 34.1364887,
      lng: -118.3569926
    }
  })
  .asPromise()
  .then(response => {
    console.log(response.json.results);
  })
  .catch(err => {
    console.log(err);
  });
*/
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
