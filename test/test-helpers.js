const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeShareLevel(){
  return[
    {
      id:1,
      level:"private",
    active:false
  }
      ,
      {id:2,
        level:"collaboration",
      active:false},

      {id:3, 
        level:"shared", active:false},
      {id:4,
    level:"public", active:false}
    
  ]
}
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'admin',
      first_name: "Dunder",
      last_name:"Mifflin",
    password: "1@Thinkful"
    },
    {
      id: 2,
      username: 'kwill',
      first_name: "Kraig",
      last_name:"Williams",
      password: '1@Thinkful'
    },
  ]
}

function makeTopicsArray(users){
 return [
    {
id:1,
topic_title:'First Test Topic',
topic_content:'Content of the first test topic',
level:1,
topic_owner:users[0].id,

},
  {
    id:2,
    topic_title:'Second Test Topic',
    topic_content:'Content of the second test topic',
    level:1,
    topic_owner:users[0].id,
   
  }

]
}


function makeExpectedTopic(users,topic){
  const owner= users.find(user=>user.id===topic.topic_owner)
  
}

function makeTopicsFixtures(){
  const testUsers = makeUsersArray()
  const testTopics = makeTopicsArray(testUsers)
  return {testUsers, testTopics}
}




function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
    comments,
    topic_connections,
      thought_connections,
      connections,
      thought,
      topic,
      
        fokul_users`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE topic_connections_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE thought_connections_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE connections_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE thought_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE topic_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE share_level_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE fokul_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('comments_id_seq', 0)`),
          trx.raw(`SELECT setval('topic_connections_id_seq', 0)`),
          trx.raw(`SELECT setval('thought_connections_id_seq', 0)`),
          trx.raw(`SELECT setval('connections_id_seq', 0)`),
          trx.raw(`SELECT setval('thought_id_seq', 0)`),
          trx.raw(`SELECT setval('topic_id_seq', 0)`),
          trx.raw(`SELECT setval('share_level_id_seq', 0)`),
          trx.raw(`SELECT setval('fokul_users_id_seq', 0)`),
          
          
        ])
      )
  )
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  //console.log("users",users)
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('fokul_users').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('fokul_users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

function seedTopicTable(db,users,topics){
  // use a transaction to group the queries and auto rollback on any failure
  console.log("the topics",topics)
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('topic').insert(topics)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('topic_id_seq', ?)`,
      [topics[topics.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
   
  })
}
module.exports = {
  seedTopicTable,
  //makeKnexInstance,
  makeUsersArray,
  makeTopicsArray,
makeTopicsFixtures,
makeExpectedTopic,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  
}
