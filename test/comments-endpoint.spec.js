const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Comments Endpoints", function () {
  let db;

  const { testThoughts, testUsers } = helpers.makeThoughtsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/comments`, () => {
    beforeEach("insert thoughts", () =>
      helpers.seedThoughtTable(db, testUsers, testThoughts)
    );

    it(`creates a comment, responding with 201 and the new comment`, function () {
      this.retries(3);
      const testThought = testThoughts[0];
      const testUser = testUsers[0];
      const newComment = {
        id: 1,
        thought_id: 1,
        comment_content: "Test new comment",
        commenter_id: testUsers[0].id,
      };
      return supertest(app)
        .post("/api/comments/1")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201);
    });

    const requiredFields = ["comment_content"];

    requiredFields.forEach((field) => {
      const testThought = testThoughts[0];
      const testUser = testUsers[0];
      const newComment = {
        comment_content: "Test new comment",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newComment[field];

        return supertest(app)
          .post("/api/comments/1")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newComment)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });
});
