const knex = require("knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../src/config");

function makeShareLevel() {
  return [
    {
      id: 1,
      level: "private",
      active: false,
    },
    { id: 2, level: "collaboration", active: false },

    { id: 3, level: "shared", active: false },
    { id: 4, level: "public", active: false },
  ];
}
function makeUsersArray() {
  return [
    {
      id: 1,
      username: "admin",
      first_name: "Dunder",
      last_name: "Mifflin",
      password: "1@Thinkful",
    },
    {
      id: 2,
      username: "kwill",
      first_name: "Kraig",
      last_name: "Williams",
      password: "1@Thinkful",
    },
  ];
}

function makeTopicsArray(users) {
  return [
    {
      id: 1,
      topic_title: "First Test Topic",
      topic_content: "Content of the first test topic",
      level: 1,
      topic_owner: 1,
    },
    {
      id: 2,
      topic_title: "Second Test Topic",
      topic_content: "Content of the second test topic",
      level: 1,
      topic_owner: 1,
    },
  ];
}
function makeThoughtsArray(users) {
  return [
    {
      id: 1,
      thought_title: "My first thought",
      thought_content: "Content of my first thought",
      thought_owner: 1,
      thought_topic: 0,
    },
    {
      id: 2,
      thought_title: "My second thought",
      thought_content: "Content of my second thought",
      thought_owner: 1,
      thought_topic: 0,
    },
  ];
}

function makeCommentsArray() {
  return [
    {
      id: 1,
      commenter_id: 1,
      comment_content: "Comment one on first thought",
      thought_id: 2,
    },
    {
      id: 2,
      commenter_id: 1,
      thought_id: 2,
      comment_content: "Comment two on first thought",
    },
    {
      id: 3,

      commenter_id: 1,
      thought_id: 2,
      comment_content: "Comment two on second thought",
    },
    {
      id: 4,

      commenter_id: 1,
      thought_id: 2,
      comment_content: "Comment two on second thought",
    },
  ];
}

function makeExpectedComments(thoughtId, comments) {
  const expectedComments = comments.filter(
    (comment) => comment.thought_id == thoughtId
  );

  return expectedComments.map((comment) => {
    return {
      id: comment.id,
      thought_id: comment.thought_id,
      commenter_id: comment.commenter_id,
      comment_content: comment.comment_content,
    };
  });
}

function makeExpectedTopic(users, topic) {
  //const owner= users.find(user=>user.id===topic.topic_owner)
  return {
    id: topic.id,
    topic_owner: topic.topic_owner,
    topic_content: topic.topic_content,
    topic_title: topic.topic_title,
  };
}

function makeExpectedThought(users, thought) {
  return {
    id: thought.id,
    thought_title: thought.thought_title,
    thought_content: thought.thought_content,
    thought_owner: thought.thought_owner,
    thought_topic: 0,
  };
}

function makeTopicsFixtures() {
  const testUsers = makeUsersArray();
  const testTopics = makeTopicsArray(testUsers);

  return { testUsers, testTopics };
}

function makeThoughtsFixtures() {
  const testUsers = makeUsersArray();
  const testThoughts = makeThoughtsArray(testUsers);
  const testComments = makeCommentsArray();
  return { testUsers, testThoughts, testComments };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256",
    expiresIn: config.JWT_EXPIRY,
  });
  return `Bearer ${token}`;
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
    comments,
    topic_connections,
      thought_connections,
      connections,
      thought,
      topic,
     fokul_users`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(
            `ALTER SEQUENCE topic_connections_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE thought_connections_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`ALTER SEQUENCE connections_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE thought_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE topic_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE share_level_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE fokul_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('comments_id_seq', 0)`),
          trx.raw(`SELECT setval('topic_connections_id_seq', 0)`),
          trx.raw(`SELECT setval('thought_connections_id_seq', 0)`),
          trx.raw(`SELECT setval('connections_id_seq', 0)`),
          trx.raw(`SELECT setval('thought_id_seq', 0)`),
          trx.raw(`SELECT setval('topic_id_seq', 0)`),
          trx.raw(`SELECT setval('share_level_id_seq', 0)`),
          trx.raw(`SELECT setval('fokul_users_id_seq', 0)`),
        ])
      )
  );
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.transaction(async (trx) => {
    await trx.into("fokul_users").insert(preppedUsers);

    await trx.raw(`SELECT setval('fokul_users_id_seq', ?)`, [
      users[users.length - 1].id,
    ]);
  });
}

function seedTopicTable(db, users, topics) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("topic").insert(topics);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('topic_id_seq', ?)`, [
      topics[topics.length - 1].id,
    ]);
    // only insert comments if there are some, also update the sequence counter
  });
}
function seedCommentsTable(db, comments) {
  return db.transaction(async (trx) => {
    await trx.into("comments").insert(comments);
    await trx.raw(`SELECT setval('comments_id_seq', ?)`, [
      comments[comments.length - 1].id,
    ]);
  });
}

function seedThoughtTable(db, users, thoughts) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    //await seedCommentsTable(trx,comments)
    await trx.into("thought").insert(thoughts);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('thought_id_seq', ?)`, [
      thoughts[thoughts.length - 1].id,
    ]);
  });
}

module.exports = {
  seedTopicTable,
  seedThoughtTable,
  seedCommentsTable,
  makeUsersArray,
  makeCommentsArray,
  makeTopicsArray,
  makeThoughtsArray,
  makeTopicsFixtures,
  makeThoughtsFixtures,
  makeExpectedTopic,
  makeExpectedThought,
  makeExpectedComments,
  makeAuthHeader,
  cleanTables,
  seedUsers,
};
