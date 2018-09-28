var express = require("express");
var maps = require("../maps");
var router = express.Router();



/* GET users listing. */
router.post("/directions", function(req, res, next) {
  req.setTimeout(0);
  res.send({ test: 123 });
  /*
  maps.Directions(req.body.from, req.body.to).then(directions => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.send(directions);
  });*/
});

router.get("/directions/:fromLat/:fromLng/:toLat/:toLng", function(
  req,
  res,
  next
) {
  req.setTimeout(0);
  console.log("Inside POST");
  res.send({ test: 123 });
});

module.exports = router;
