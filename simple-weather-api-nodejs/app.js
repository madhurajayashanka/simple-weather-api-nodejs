const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "API KEY";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" +
    query +
    "&appid=" +
    apiKey;
  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      try {
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const weatherWescription = weatherData.weather[0].description;
        
        const icon = weatherData.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        
        res.render("success", {
          temp: temp,
          desc: weatherWescription,
          icon: iconUrl,
          city:city
        });
      } catch (e) {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
});
