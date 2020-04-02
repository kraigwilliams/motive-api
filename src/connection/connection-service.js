const ConnectionService= {

  getAllConnections(knex,senderId){
    return knex
      .from('fokul_users')
      .select('*')
      .join('connections','fokul_users.id', '=', "connections.receiver_id")
      .where('connections.sender_id',senderId)
      .orWhere('connections.receiver_id',senderId)

  },


  insertConnection(knex,senderID, recieverID) {
    return knex
      .into("connections")
      .insert({sender_id: senderId, reciever_id: recieverId})
        
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

        
  getNonConnections(knex,userId){
    let fokulId= 'fokul_users.id';
    return knex
      .select('*')
      .from('fokul_users')
      .whereNot({'fokul_users.id' : userId})
      .whereNotExists(function(){
        this.select('*').from('connections')
          .whereRaw('connections.sender_id = fokul_users.id');
        // 'connections.receiver_id' : userId);
        //.orWhere({'connections.sender_id' : userId, 'connections.receiver_id' : 'fokul_users.id'});
      }); 
  }
};

module.exports= ConnectionService;