const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const database = require("./database");

const getMovies = async (req, res) => {
  try {
    const [movies] = await database.query("SELECT * FROM movies");
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getMovieById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [movies] = await database.query("SELECT * FROM movies WHERE id = ?", [
      id,
    ]);

    if (movies.length > 0) {
      res.json(movies[0]);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};

const express = require("express");
const app = express();

const movieControllers = require("../controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.post("/api/movies", movieControllers.postMovie);

const port = 5000;
app.listen(port, () => {
  console.log(`The server operates on the ${port}`);
});
