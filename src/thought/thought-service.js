const ThoughtService= {
    getAllThoughts(knex,id){
        return knex.from('thought').select('*')
        .where('topic_owner',id)
    },
    
    insertThought(knex, newThought){
        return 
        knex 
        .insert(newThought)
        .into("thought")
        .returning("*")

    }


}

module.exports= ThoughtService
