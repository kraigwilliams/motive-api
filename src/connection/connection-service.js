const ConnectionService= {

  getAllConnections(knex,userId){
    return knex
      .from('fokul_users')
      .select('*')
      .join('connections', function(){
        this.on('fokul_users.id', '=', 'connections.receiver_id').orOn('fokul_users.id', '=', 'connections.sender_id');
      })
      .where(function() {
        this.where('connections.sender_id', userId).orWhere('connections.receiver_id', userId).whereNot('fokul_users.id', userId);
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
    return knex
      .raw(
        `select * from fokul_users
        where fokul_users.id != ${userId}
        and not exists (select 1 from connections where (connections.sender_id = fokul_users.id and connections.receiver_id = ${userId})
        or (connections.sender_id = ${userId} and connections.receiver_id = fokul_users.id))`
      ); 
  }
};

module.exports= ConnectionService;