
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Thought Endpoints', function(){
    let db
    const {testUsers, testThoughts} = helpers.makeThoughtsFixtures()
    
    

before('make knex instance', ()=>{
    db = knex({
        client:'pg',
        connection: process.env.TEST_DATABASE_URL
    })
    app.set('db',db)
})


after('disconnect from db', ()=>db.destroy())

before('cleanup', ()=>helpers.cleanTables(db))

afterEach('cleanup', ()=>helpers.cleanTables(db))


describe(`Get /api/thought`, ()=>{

    context(`Given no thoughts`, ()=>{
        beforeEach('insert thoughts',()=>
        helpers.seedUsers(
            db,
            testUsers
        )

        )
        it(`responds with 200 and an empty thought list`,()=>{
            return supertest(app)
            
            .get('/api/thought')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200,[])
        })
    })

    context('Given there are thoughts in the database',()=>{
        beforeEach('insert thoughts',()=>
            helpers.seedThoughtTable(
                db,
                testUsers,
                testThoughts
                
            )
        
    )

    it('responds with 200 and all of the thoughts',()=>{
        const expectedThoughts= testThoughts.map(thought=>
            helpers.makeExpectedThought(
                testUsers,
                thought
            ))
            return supertest(app)
            
            .get('/api/thought')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200,expectedThoughts)
    })

    })



    describe(`GET /api/thought/:thoughtId`,()=>{
        context (`Given a wrong thought Id`, ()=>{
            beforeEach(()=>
                helpers.seedUsers(db,testUsers)
    
    
            )
            it(`responds with 404`,()=>{
                const fakeThought = 123456
                return(supertest(app)
                
                .get(`/api/thought/${fakeThought}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: `This thought does not exist.` }})
                )
            })
    
        })
    })
    
})

})