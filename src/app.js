require("dotenv").config();
const port = process.env.APP_PORT;

const express = require("express");

const app = express();

const movieControllers = require("./controllers/movieControllers");

const userControllers = require("./controllers/userControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUserById);
app.use(express.json());
app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", userControllers.updateUser);

module.exports = app;

