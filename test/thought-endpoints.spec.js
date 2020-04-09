const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Thought Endpoints", function () {
  let db;
  const {
    testUsers,
    testThoughts,
    testComments,
  } = helpers.makeThoughtsFixtures();

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
  beforeEach("cleanup", () => helpers.cleanTables(db));

  describe(`Get /api/thought`, () => {
    context(`Given no thoughts`, () => {
      beforeEach("insert thoughts", () => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and an empty thought list`, () => {
        return supertest(app)
          .get("/api/thought")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are thoughts in the database", () => {
      beforeEach("insert thoughts", () =>
        helpers.seedThoughtTable(db, testUsers, testThoughts)
      );

      it("responds with 200 and all of the thoughts", () => {
        const expectedThoughts = testThoughts.map((thought) =>
          helpers.makeExpectedThought(testUsers, thought)
        );
        return supertest(app)
          .get("/api/thought")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedThoughts);
      });
    });
  });

  describe(`GET /api/thought/:thoughtId`, () => {
    context(`Given a wrong thought Id`, () => {
      //   before('cleanup', ()=>helpers.cleanTables(db))
      beforeEach(() => helpers.seedUsers(db, testUsers));
      //before("insert thoughts", () => helpers.seedThoughtTable(db, testUsers, testThoughts));
      //after('cleanup', ()=>helpers.cleanTables(db))

      it(`responds with 404 when given a wrong thought id`, () => {
        const fakeThought = 123456;
        return supertest(app)
          .get(`/api/thought/${fakeThought}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: `This thought does not exist.` },
          });
      });
    });

    context("Given there are comments for thought in the database", () => {
      // before(()=>  helpers.seedUsers(db,testUsers))

      beforeEach("insert thoughts", () =>
        helpers.seedThoughtTable(db, testUsers, testThoughts)
      );
      beforeEach("insert comments", () => {
        return helpers.seedCommentsTable(db, testComments);
      });

      it("responds with 200 and the specified comments", () => {
        const thoughtId = 1;
        const expectedComments = helpers.makeExpectedComments(
          thoughtId,
          testComments
        );
        return supertest(app)
          .get(`/api/thought/1`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedComments);
      });
    });
  });
});
