const CommentService={

getComments(knex,thoughtId){
return knex.from('comments').select('*')
.join("fokul_users")

.where({"comments.commenter_id":"fokul_users.id",
"thought_id": thoughtId
})
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