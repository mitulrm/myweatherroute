/*Script to manage Database operations*/

const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const maps = require("./maps");

/*Establish connection with Database, also create directions_weather table if it doesn't exist*/
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

/*Insert data to table with current timestamp. */
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
      console.error(`Error: ${err}`);
    }
  });
  db.close();
};

/*Fetch data for a given from and to request, and return latest record. */
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

  let params = [fromLatLng.lat, fromLatLng.lng, toLatLng.lat, toLatLng.lng];
  let db = getConnection();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        db.close();
        resolve(row);
      }
    });
  });
};

/*Find how much hours old given record is */
getTimeDiff = row => {
  let dataTime = new Date(row.Timestamp);
  return (Date.now() - dataTime) / 3600000;
};

/*Return direction and weather data for a given from and to locations.
First it checks if data exists in table. If record is found, if it is older than specified amount of hours, it fetches new data from API, inserts new record in table and return the lates data.
Else return the data retrieved from table. Time window for refreshing data can be specified in DATA_REFRESH_MARGIN variable in env file */
function getDirections(fromLatLng, toLatLng) {
  return select(fromLatLng, toLatLng)
    .then(result => {
      if (result && getTimeDiff(result) <= process.env.DATA_REFRESH_MARGIN) {
        console.log("Directions fetched from DB");
        return JSON.parse(result.Directions);
      } else {
        return maps
          .directions(fromLatLng, toLatLng)
          .then(directions => {
            insert(fromLatLng, toLatLng, JSON.stringify(directions).toString());
            console.log("Directions fetched from Google Maps API");
            return directions;
          })
          .catch(err => {
            console.error(err);
          });
      }
    })
    .catch(err => console.error(err));
}
exports.getDirections = getDirections;
