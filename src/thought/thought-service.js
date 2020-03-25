const ThoughtService= {
    getAllThoughts(knex,id){
        return knex.from('thought').select('*')
        // .where('user_id',id)
    }


}

module.exports= ThoughtService
