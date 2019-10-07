require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const moviesArr = require("./moviesData.json");

const app = express();
//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use(function validateToken(req, res, next) {
  const API_TOKEN = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== API_TOKEN) {
    res.status(404).send({ error: "Bad Request/AuthToken" });
  }
  next();
});

//Routes

app.get("/movie", (req, res) => {
  let response = moviesArr;

  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(
      movie => parseInt(movie.avg_vote) >= parseInt(req.query.avg_vote)
    );
  }

  res.json(response);
});

//Start the Server
app.listen(8000, () => {
  console.log("Listening on port 8000");
});
