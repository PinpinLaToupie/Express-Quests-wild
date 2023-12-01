require("dotenv").config();
const port = process.env.APP_PORT;

const express = require("express");

const app = express();

const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");

const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUserById);

app.use(express.json());

app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", userControllers.updateUser);

app.post("/api/movies", validateMovie, movieControllers.postMovie);
app.put("/api/movies/:id", validateMovie, movieControllers.updateMovie);

app.post("/api/users", validateUser, userControllers.postUser);
app.put("/api/users/:id", validateUser, userControllers.updateUser);

app.delete("/api/movies/:id", movieControllers.deleteMovie);
app.delete("/api/users/:id", userControllers.deleteUser);

module.exports = app;
