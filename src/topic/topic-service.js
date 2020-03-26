const TopicService = {
  getAllTopics(knex, id) {
    return knex
      .from("topic")
      .select("*")
      .where("topic_owner", id);
  },

  insertTopic(knex, newTopic) {
    return knex
      .insert(newTopic)
      .into("topic")
      .returning("*")
      .then(rows=>{
          return rows[0]
      })
      ;
  },

  getById(knex, topicId) {
    return knex
      .from("topic")
      .select("topic.*")
      .first()
      .where("id", topicId)
      .returning("*");
  },

  deleteTopic(knex, topicId) {
    return knex("topic")
      .where("id", topicId)
      .delete();
  },
  updateTopic(knex, id, newTopicFields) {
    return knex("topics")
      .where({ id })
      .update(newTopicFields);
  }
};

module.exports = TopicService;
