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
        getNonConnections(knex,senderId){
            return knex
           

            //'fokul_users.id', '=', "connections.receiver_id"

            .from('fokul_users')
        .select('fokul_users.id','fokul_users.username','fokul_users.first_name','fokul_users.last_name')
        .join('connections')
        .whereNot(
            {'connections.sender_id':senderId,
            //   fokul_users.id:senderId,
              'connections.receiver_id':senderId 
            //   'fokul_users.id':'connections.receiver_id',
            //   'fokul_users.id':'connections.receiver_id',
            })
            // .orWhereNot('connections.receiver_id',senderId)
            // .orWhereNot('fokul_users.id',senderId)
            //.orWhereNot('connections.sender_id',senderId)
        

        }
}


module.exports= ConnectionService