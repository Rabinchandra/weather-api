const express = require("express");
const app = express();
const { getCitiesCoordinates, getCitiesWeather } = require("./api/utilities");

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.post("/getWeather", async (req, res) => {
  const cities = req.body.cities;
  console.log(req.body);

  if (cities) {
    try {
      let coordinates = await getCitiesCoordinates(cities);
      const result = await getCitiesWeather(coordinates);
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: "Something went wrong" });
    }
  } else {
    res.status(400).send({ error: "Please provide cities" });
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(5001, () => console.log("Listening on PORT 5001"));
