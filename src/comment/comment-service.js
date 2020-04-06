const CommentService={

getComments(knex,thoughtId){
return knex.from('comment').select('*')
.where('thought_id', thoughtId)
},

insertComment(knex,newComment){
    return knex.insert(newComment)
    .into("comments")
    .returning("*")
    .then(rows=>{
        return rows[0]
    })
}


}

module.exports= CommentService