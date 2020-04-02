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
            return
            knex
              //.select('*')
              //.from('fokul_users')
              //.whereNot({'fokul_users.id' : userId})
              //.whereNotExists(function(){
                .select('*').from('connections')
                //.where({'connections.sender_id' : '1', 'connections.receiver_id' : '2'})
                 // .orWhere({'connections.sender_id' : '2', 'connections.receiver_id' : '1'});

                 
              //});       
          
  
        
}

}

module.exports= ConnectionService