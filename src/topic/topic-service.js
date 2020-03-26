const TopicService= {
    getAllTopics(knex,id){
        return knex.from('topic').select('*')
         .where('topic_owner',id)
    },

    insertTopic(knex,newTopic){

return knex
.insert(newTopic)
.into("topic")
.returning("*")
    },

    getById(knex,topicId){
        return knex.from('topic').select('topic.*').where('id', topicId)
    },
    
    deleteTopic(knex,topicId){
        return knex('topic')
        .where('id',topicId)
        .delete()
    },
    updateTopic(knex,id, newTopicFields){
        return knex('topics')
        .where({id})
        .update(newTopicFields)
    }


}

module.exports= TopicService
