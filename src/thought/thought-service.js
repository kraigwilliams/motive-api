const ThoughtService= {
    getAllThoughts(knex,id){
        return knex.from('thought').select('*')
        // .where('user_id',id)
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
