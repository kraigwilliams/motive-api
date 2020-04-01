const ConnectionService= {

    getAllConnections(knex,senderId){
        return knex
        .from('connection')
        .select('*')
        .where('receiver_id',senderId)
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
        GetNewConnection(knex,senderId){
            return knex.
            .from('connection')
            .select('*')
            .whereNot('sender_id',senderId)

        }
}


module.exports= ConnectionService