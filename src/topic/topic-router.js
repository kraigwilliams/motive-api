const express = require('express')
const path= require("path");
const xss = require("xss")
const TopicService = require('./topic-service')
const { requireAuth } = require('../middleware/jwt-auth')


const topicRouter = express.Router()

const jsonBodyParser = express.json()

const serializeTopic = topic => ({
    id: Number(topic.id),
    topic_title: xss(topic.topic_title),
    topic_content: xss(topic.topic_content),
    topic_owner:Number(topic.topic_owner)
     
  });


topicRouter
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

topicRouter
.route('/')
  .get( async (req, res, next) => {
      const knexInstance= req.app.get('db')
      const userId=req.user.id
      console.log("user id", req.user.id)
    try {
      const topics = await TopicService.getAllTopics(knexInstance,Number(req.user.id))
     
      


      res.json(topics.map(serializeTopic))
        
      
    } 
    catch (error) {
      next(error)
    }
  })

  .post(jsonBodyParser, async(req, res, next) => {
      try{
    const { topic_title, topic_content } = req.body;
    const newTopic = { topic_title, topic_content };

    for (const [key, value] of Object.entries(newTopic)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    newTopic.topic_owner = req.user.id;

    const topic = await TopicService.insertTopic(req.app.get("db"), newTopic)
    
    
    
    
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${topic.id}`))

          .json(serializeTopic(topic));
      

      }
      catch(error){
        next(error)
      }
      
  });



topicRouter
.route('/:topicId')
  .get( async (req, res, next) => {
    
    try {

 const knexInstance = req.app.get("db");
       const topic=  await TopicService.getById(knexInstance, Number(req.params.topicId))
       if (!topic) {
        return res.status(404).json({
          error: { message: `This topic does not exist.` }
        });
      }
      else{
      res.json(serializeTopic(topic));
      }
    
    } catch(error) {
      next(error)
    }
    

    
  })


module.exports = topicRouter
