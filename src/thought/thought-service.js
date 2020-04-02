const ThoughtService= {
  getAllThoughts(knex,id){
    return knex.from('thought').select('*')
      .where('thought_owner',id);
  },

  getSharedTopics(knex, id) {
    return knex.raw(
      `SELECT * FROM thought
        LEFT JOIN thought_connections 
        ON thought.id = thought_connections.thought_id
        WHERE thought_connections."shared_userId"=${id};`
    )
      .then(results => {
        return results.rows;
      });
  },
    
  insertThought(knex, newThought){
    return (
      knex 
        .insert(newThought)
        .into('thought')
        .returning('*')
        .then(rows => {
          return rows[0];
        })
    );
  },
  getById(knex, thoughtId) {
    return knex
      .from('thought')
      .select('thought.*')
      .first()
      .where('id', thoughtId)
      .returning('*');
  },

  updateThought(knex,thoughtId,newNoteFields){
    return knex('thought')
      .where('id',thoughtId)
      .update(newNoteFields)
      .returning('*')
      .then(rows=>{
        return rows[0];
      });

  },


  deleteThought(knex, thoughtId) {
    return knex('thought')
      .where('id', thoughtId)
      .delete();
  }
};

module.exports= ThoughtService;
