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
    const [movies] = await database.query("SELECT * FROM movies WHERE id = ?", [id]);

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

module.exports = {
  getMovies,
  getMovieById,
};


