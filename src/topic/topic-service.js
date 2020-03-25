const TopicService= {
    getAllTopics(knex,id){
        return knex.from('topic').select('*')
        .where('user_id',id)
    }


}