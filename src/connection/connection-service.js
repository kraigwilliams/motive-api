const ConnectionService= {

  getAllConnections(knex,userId){
    return knex.raw(
      `SELECT
        fokul_users.id, fokul_user.first_name, fokul_users.last_name, fokul_users.username
    FROM
        fokul_users
        INNER JOIN connections ON fokul_users.id = connections.receiver_id
            OR fokul_users.id = connections.sender_id
    WHERE
        (connections.sender_id = ${userId} OR connections.receiver_id = ${userId})
        AND NOT (fokul_users.id = ${userId} )
        ;
    `
    )
      .then(result => {
        return result.rows;
      });
  },


  insertConnection(knex,senderId, recieverId) {
    return knex
      .into('connections')
      .insert({sender_id: senderId, reciever_id: recieverId})
        
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

        
  getNonConnections(knex,userId){
    return knex.raw(
      `select fokul_users.id, fokul_user.first_name, fokul_users.last_name, fokul_users.username
      from fokul_users
      where fokul_users.id != ${userId}
      and not exists (select 1 from connections where (connections.sender_id = fokul_users.id and connections.receiver_id = ${userId})
      or (connections.sender_id = ${userId} and connections.receiver_id = fokul_users.id))`
    )
      .then(result => {
        return result.rows;
      }); 
  },
};

module.exports= ConnectionService;