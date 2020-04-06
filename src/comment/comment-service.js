const CommentService={

getComments(knex,thoughtId){
return knex.raw(
    `
    SELECT fokul_users.username, fokul_users.first_name, fokul_users.last_name, comments.comment_content, comments.date_posted FROM comments JOIN fokul_users ON comments.commenter_id = fokul_users.id WHERE comments.thought_id = ${thoughtId};
    `
)
.then(results => {
    return results.rows;
  });


    // return knex.from('comments')
// .join("fokul_users","fokul_users.id","=","comments_commenter_id")
// .select('')
// .where({"comments.commenter_id":"fokul_users.id",
// "thought_id": thoughtId
// })
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