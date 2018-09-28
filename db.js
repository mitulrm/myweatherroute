const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const maps = require("./maps");

getConnection = () => {
  let db = new sqlite3.Database("./db/weathermap.db", err => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log("Connected to the database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS directions_weather(
        FromLat REAL, 
        FromLng REAL, 
        ToLat REAL, 
        ToLng REAL, 
        Directions blob, 
        Timestamp TEXT DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  });
  return db;
};

insert = (fromLatLng, toLatLng, directions) => {
  let sql = `INSERT INTO directions_weather(
              FromLat, 
              FromLng, 
              ToLat, 
              ToLng, 
              Directions, 
              Timestamp) 
            VALUES(
              ?,
              ?,
              ?,
              ?,
              ?,
              strftime("%Y-%m-%d %H:%M:%S", "now")
              )`;
  //console.log(sql);
  let params = [
    fromLatLng.lat,
    fromLatLng.lng,
    toLatLng.lat,
    toLatLng.lng,
    directions
  ];
  let db = getConnection();

  db.run(sql, params, err => {
    if (err) {
      console.log(`Error: ${err}`);
    }
    console.log(`Rows inserted ${this.changes}`);
  });
  db.close();
};

select = (fromLatLng, toLatLng) => {
  let sql = `Select 
              Directions, 
              datetime(Timestamp, 'localtime')  as Timestamp
            From directions_weather 
            WHERE FromLat = ?
              AND FromLng = ?
              AND ToLat = ?
              AND ToLng = ?
            ORDER BY Timestamp DESC`;
  //console.log(sql);
  let params = [fromLatLng.lat, fromLatLng.lng, toLatLng.lat, toLatLng.lng];
  let db = getConnection();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        //console.log(row.Timestamp);
        db.close();
        resolve(row);
      }
    });
  });
};
getTimeDiff = row => {
  let dataTime = new Date(row.Timestamp);
  //let timeDiff = (Date.now() - pastTime) / 3600000;
  //console.log(`${pastTime} ${Date.now()} ${timeDiff} `);
  return (Date.now() - dataTime) / 3600000;
};

function getDirections(fromLatLng, toLatLng) {
  return select(fromLatLng, toLatLng)
    .then(result => {
      if (result && getTimeDiff(result) <= process.env.DATA_REFRESH_MARGIN) {
        console.log("Directions fetched from DB");
        return JSON.parse(result.Directions);
      } else {
        return (
          maps
            .directions(fromLatLng, toLatLng)
            //.then(directions => directions.json())
            .then(directions => {
              insert(
                fromLatLng,
                toLatLng,
                JSON.stringify(directions).toString()
              );
              console.log("Directions fetched from Google Maps API");
              return directions;
            })
            .catch(err => {
              console.log(err);
            })
        );
      }
    })
    .catch(err => console.error(err));
}
/*
getDirections(
  { lat: 42.88644679999999, lng: -78.8783689 },
  { lat: 40.7127753, lng: -74.0059728 }
)
  .then(result => {
    console.log(result.json.routes[0].legs[0].steps[0]);
  })
  .catch(err => console.error(err));
*/
/*
db = getConnection();
var result = new Promise((resolve, reject) => {
  db.get(
    "Select * from directions_weather order by Timestamp DESC",
    (error, row) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(row);
      }
    }
  );
});
result.then(result => console.log(result.Timestamp));
db.close();*/
/*select(
  { lat: 42.88644679999999, lng: -78.8783689 },
  { lat: 40.7127753, lng: -74.0059728 }
)
  .then(result => {
    console.log(result.Timestamp);
  })
  .catch(err => console.error(err));
*/
exports.getDirections = getDirections;
