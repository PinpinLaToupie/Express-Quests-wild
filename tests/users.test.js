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
      city: "Rio de Janeiro",
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
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Je",
      lastname: "Ne",
      email: "suis@example.com",
      city: "Pas",
      language: "La",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});

describe("DELETE /api/users/:id", () => {
  test("should delete a user with a valid ID and return 204", async () => {
    const response = await request(app).delete("/api/users/1");

    expect(response.status).toBe(204);
  });

  test("should return 404 for a non-existing user ID", async () => {
    const response = await request(app).delete("/api/users/999");

    expect(response.status).toBe(404);
  });
});