const TopicService= {
    getAllTopics(knex,id){
        return knex.from('topic').select('*')
        // .where('user_id',id)
    },

    insertTopic(knex,newTopic){

return knex
.insert(newTopic)
.into("topic")
.returning("*")
    }


}

module.exports= TopicService
