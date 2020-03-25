// const express = require('express')
// const TopicService = require('./topic-service')
// const { requireAuth } = require('../middleware/jwt-auth')


// const topicRouter = express.Router()

// const jsonBodyParser = express.json()

// const serializeTopic = topic => ({
//     id: Number(topic.id),
//     topic_name: xss(topic.topic_name),
//     topic_url: xss(topic.topic_url),
    
     
//   });


// topicRouter
//   .use(requireAuth)

// //   .use(async (req, res, next) => {
// //     try {
// //       const topics = await topicService.getAllTopics(
// //         req.app.get('db'),
// //         req.user.id,
// //       )

// //       if (!topics)
// //         return res.status(404).json({
// //           error: `You don't have any topics`,
// //         })

// //       req.topics = topics
// //       next()
// //     } catch (error) {
// //       next(error)
// //     }
// //   })

// topicRouter
// .route('/')
//   .get( async (req, res, next) => {
//       const knexInstance= req.app.get('db')
//       const user=req.user.id
//     try {
//       const topics = await TopicService.getAllTopics(knexInstance,Number(req.user.id))
     
      


//       res.json(topics.map(serializeTopic))
        
      
//     } 
//     catch (error) {
//       next(error)
//     }
//   })

// topicRouter
// .route('/:topicId')
//   .get( async (req, res, next) => {
    
//     try {
    
//     } catch(error) {
//       next(error)
//     }
    

    
//   })


// module.exports = languageRouter
