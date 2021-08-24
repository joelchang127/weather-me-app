const express = require("express");
const fetch = require("node-fetch")
const Datastore = require("nedb");
const app = express();
var port = process.env.PORT || 8080;
require('dotenv').config();

// pass into Datastore() the location in my local device where the database will live
// loadDatabase() loads what was in the previous database into memory
const database = new Datastore('database.db');
database.loadDatabase();

app.use(express.json({limit: "1mb"}));

app.listen(port || 8080, () => {
    console.log(`Listening at port ${port}`);
})

// choose the route where it will receive the post 
// called api because this is the api for clients to send data to me
// req = all the information that is contained within that request. any data
// res = variable i can use to send things back to the client
app.post("/api", (req, res) => {
    console.log("I got a post request!");
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);
})

app.get("/api", (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    })
})

app.get("/weather/:lat/:lon", async (req, res) => {
  lat = req.params.lat;
  lon = req.params.lon;
  const api_key_weather = process.env.API_KEY_1;
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key_weather}&units=imperial`
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const api_key_aq = process.env.API_KEY_2;
  const aq_url = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${api_key_aq}`
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();
  const data = {
    weather: weather_data,
    air_quality: aq_data
  }
  res.json(data);
})



// use express to host static files
// write a directory (folder) or a file in express.static(___)
// basically saying whatever's in this directory, is publicly accessible from the url 
// which is localhost:8080 here
app.use(express.static("public"));