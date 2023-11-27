const database = require("./database");

const getUsers = async (req, res) => {
  try {
    const [users] = await database.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
  
    try {
      const [user] = await database.query("SELECT * FROM users WHERE id = ?", [userId]);
  
      if (user.length > 0) {
        res.status(200).json(user[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };
  
  module.exports = {
    getUsers,
    getUserById,
  };
