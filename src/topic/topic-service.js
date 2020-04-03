const TopicService = {
  getAllTopics(knex, id) {
    return knex
      .from('topic')
      .select('*')
      .where('topic_owner', id);
  },

  getSharedTopics(knex, id) {
    return knex.raw(
      `SELECT * FROM topic
      LEFT JOIN topic_connections 
      ON topic.id = topic_connections.topic_id
      WHERE topic_connections."shared_userId"=${id};`
    )
      .then(results => {
        return results.rows;
      });
  },

  insertTopic(knex, newTopic) {
    return (knex
      .insert(newTopic)
      .into('topic')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
    );
  },

  getById(knex, topicId) {
    return knex
      .from('topic')
      .select('*')
      .first()
      .where('id', topicId)
      .returning('*');
  },

  deleteTopic(knex, topicId) {
    return knex('topic')
      .where('id', topicId)
      .delete();
  },

  // updateTopic(knex, id, newTopicFields) {
  //   return knex("topic")
  //     .where({ id })
  //     .update(newTopicFields);
  // },

  getAllThoughts(knex, topicId) {
    return knex
      .from('thought')
      .select('thought.*')
      .where('thought_topic', topicId);
  },

  updateTopic(knex,topicId,newTopicFields){
    return knex('topic')
      .where('id',topicId)
      .update(newTopicFields)
      .returning('*')
      .then(rows=>{
        return rows[0];
      });  
  },

  shareTopic(knex, sharedTopic) {
    return knex
      .insert(sharedTopic)
      .into('topic_connections')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getTopicLevel(knex, topicId, userId) {
    return knex 
      .from('topic_connections')
      .select('topic_connections.level')
      .where({'shared_userId': userId , 'topic_id': topicId})
      .returning('*')
      .first();
  }

  // insertTopicThoughtsShared(knex, sharedTopic){
  //   return knex('topic_connections')
  //     .into('topic_connections')
  //     .
  // }
};

module.exports = TopicService;
