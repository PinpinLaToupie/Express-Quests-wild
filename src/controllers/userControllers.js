// userControllers.js

const database = require("./database");

const getUsers = async (req, res) => {
  try {
    const [users] = await database.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [users] = await database.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postUser = async (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({ message: "Firstname, lastname, and email are required." });
  }

  try {
    const result = await database.query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    );

    const insertedUserId = result[0].insertId;
    const [insertedUser] = await database.query("SELECT * FROM users WHERE id = ?", [insertedUserId]);

    res.status(201).json(insertedUser[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
};
