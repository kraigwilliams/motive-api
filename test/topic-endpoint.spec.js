
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Topic Endpoint', function(){
    let db

const{
    testUsers,
    testTopics
}= helpers.makeTopicsFixtures()

const blackTopics =[]
before('make knex instance', ()=>{
    db = knex({
        client:'pg',
        connection: process.env.TEST_DATABASE_URL
    })
    app.set('db',db)
})

after('disconnect from db', ()=>db.destroy())
before('cleanup',()=> helpers.cleanTables(db))
afterEach('cleanup', ()=>helpers.cleanTables(db))

describe(`GET /api/topic`, ()=>{

    context(`Given no topics`, ()=>{
        beforeEach('insert topics',()=>
        helpers.seedUsers(
            db,
            testUsers
            
        )
    
)
        it(`responds with 200 and an empty list`,()=>{
            return supertest(app)
            
            .get('/api/topic')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200,[])
        })
    })

    context('Given there are topics in the database',()=>{
        beforeEach('insert topics',()=>
            helpers.seedTopicTable(
                db,
                testUsers,
                testTopics
                
            )
        
    )

    it('responds with 200 and all of the topics',()=>{
        const expectedTopics= testTopics.map(topic=>
            helpers.makeExpectedTopic(
                testUsers,
                topic
            ))
            return supertest(app)
            
            .get('/api/topic')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200,expectedTopics)
    })
})




})

describe(`GET /api/topic/:topicId`,()=>{
    context (`Given no topics`, ()=>{
        beforeEach(()=>
            helpers.seedUsers(db,testUsers)


        )
        it(`responds with 404`,()=>{
            const fakeTopic = 123456
            return(supertest(app)
            
            .get(`/api/topic/${fakeTopic}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, {
                error: { message: `This topic does not exist.` }})
            )
        })

    })
})
})
