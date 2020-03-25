const express = require('express')
const path= require("path");
const xss = require("xss")
const ThoughtService = require('./thought-service')
const { requireAuth } = require('../middleware/jwt-auth')


const thoughtRouter = express.Router()

const jsonBodyParser = express.json()

const serializeThought = thought => ({
    id: Number(thought.id),
    thought_title: xss(thought.thought_title),
    thought_content: xss(thought.thought_content)
    
     
  });


thoughtRouter
  .use(requireAuth)

//   .use(async (req, res, next) => {
//     try {
//       const topics = await topicService.getAllTopics(
//         req.app.get('db'),
//         req.user.id,
//       )

//       if (!topics)
//         return res.status(404).json({
//           error: `You don't have any topics`,
//         })

//       req.topics = topics
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })

thoughtRouter
.route('/')
  .get( async (req, res, next) => {
      const knexInstance= req.app.get('db')
      const user=req.user.id
      console.log("user id", req.user.id)
    try {
      const thoughts = await ThoughtService.getAllThoughts(knexInstance,Number(req.user.id))
     
      


      res.json(thoughts.map(serializeThought))
        
      
    } 
    catch (error) {
      next(error)
    }
  })

thoughtRouter
.route('/:thoughtId')
  .get( async (req, res, next) => {
    
    try {
    
    } catch(error) {
      next(error)
    }
    

    
  })


module.exports = thoughtRouter
