const request = require("supertest");
const app = require("../src/app");
const database = require("../src/controllers/database");

afterAll(async () => {
  await database.end();
});

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { title: "Harry" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit users", async () => {
    const newUser = {
      firstname: "Raoul",
      lastname: "Paul",
      email: "raoul.paul@example.com",
      city: "Rio de Jainero",
      language: "Portuguese",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Jean",
      lastname: "Robert",
      email: "jean.robert@example.com",
      city: "Thaiti",
      language: "French",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = users;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updateduser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updateduser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updateduser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updateduser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updateduser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newuser = {
      firstname: "Raoul",
      lastname: "Paul",
      email: "raoul.paul@example.com",
      city: "Rio de Jainero",
      language: "Portuguese",
    };

    const response = await request(app).put("/api/users/0").send(newuser);

    expect(response.status).toEqual(404);
  });
});
