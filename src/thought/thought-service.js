/* eslint-disable strict */
const ThoughtService = {
  getAllThoughts(knex, id) {
    return knex.from("thought").select("*").where("thought_owner", id);
  },

  getSharedThoughts(knex, id) {
    return knex
      .raw(
        `SELECT * FROM thought
        LEFT JOIN thought_connections 
        ON thought.id = thought_connections.thought_id
        WHERE thought_connections."shared_userId"=${id};`
      )
      .then((results) => {
        return results.rows;
      });
  },

  insertThought(knex, newThought) {
    return knex
      .insert(newThought)
      .into("thought")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, thoughtId) {
    return knex
      .raw(
        `SELECT *
FROM thought
LEFT JOIN fokul_users ON thought.thought_owner = fokul_users.id
WHERE thought.id = ${thoughtId};`
      )
      .then((results) => {
        return results.rows[0];
      });
  },

  getSharedUsersById(knex, thoughtId) {
    return knex
      .raw(
        `
      SELECT * 
      from thought_connections
      LEFT JOIN fokul_users ON fokul_users.id = thought_connections."shared_userId"
      WHERE thought_connections.thought_id = ${thoughtId};`
      )
      .then((results) => {
        return results.rows;
      });
  },

  getThoughtLevel(knex, thoughtId, userId) {
    return knex
      .from("thought_connections")
      .select("thought_connections.level")
      .where({ shared_userId: userId, thought_id: thoughtId })
      .returning("*")
      .first();
  },

  updateThought(knex, thoughtId, newNoteFields) {
    return knex("thought")
      .where("id", thoughtId)
      .update(newNoteFields)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  deleteThought(knex, thoughtId) {
    return knex("thought").where("id", thoughtId).delete();
  },

  shareThought(knex, sharedThought) {
    return knex
      .insert(sharedThought)
      .into("thought_connections")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ThoughtService;
