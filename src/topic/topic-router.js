const express = require("express");
const path = require("path");
const xss = require("xss");
const TopicService = require("./topic-service");
const { requireAuth } = require("../middleware/jwt-auth");

const topicRouter = express.Router();

const jsonBodyParser = express.json();

const serializeTopic = topic => ({
  id: Number(topic.id),
  topic_title: xss(topic.topic_title),
  topic_content: xss(topic.topic_content),
  topic_owner: Number(topic.topic_owner)
});

topicRouter.use(requireAuth);

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
.route("/:topicId/thoughts")
.get(async (req,res,next)=>{
    const knexInstance = req.app.get("db");
    const userId = req.user.id;

   try{
       const thoughts= await TopicService.getAllThoughts(knexInstance,req.params.topicId)
console.log(thoughts,"this is all the thoughts")
      res.json(thoughts)
   } 

catch(error){
  console.log("error from get all thoughts in a topic",error)
    next(error)
}


}) 

topicRouter
  .route("/")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = req.user.id;
    console.log("user id", req.user.id);
    try {
      const topics = await TopicService.getAllTopics(
        knexInstance,
        Number(req.user.id)
      );

      res.json(topics.map(serializeTopic));
    } catch (error) {
      next(error);
    }
  })

  .post(jsonBodyParser, async (req, res, next) => {
    try {
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

      const topic = await TopicService.insertTopic(req.app.get("db"), newTopic);

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${topic.id}`))

        .json(serializeTopic(topic));
    } catch (error) {
      next(error);
    }
  });

  topicRouter
  .route("/shared")
  .get(async (req, res, next) => {
    const userId = Number(req.user.id);
    try {
      const knexInstance = req.app.get('db');
      const sharedTopics = await TopicService.getSharedTopics(
        knexInstance, 
        userId
      ) 
      res.json(sharedTopics)
    } 
    catch(error) {
      console.log("get shared topics by user id error start",error, "get shared topics by user id error end")
        next(error);
    }
  })

topicRouter
.route("/:topicId")
.get(async (req, res, next) => {
  try {
    const knexInstance = req.app.get("db");
    const topic = await TopicService.getById(
      knexInstance,
      Number(req.params.topicId)
    );
    console.log("topic", topic, "then", req.params.topicId, "req.params");
    if (!topic) {
      return res.status(404).json({
        error: { message: `This topic does not exist.` }
      });
    }

    res.json(serializeTopic(topic));
  } 
  catch (error) {
  console.log("get topic by id error start", error,"get topic by id error end")
    next(error);
  }
})
.patch(jsonBodyParser,async (req,res,next)=>{
  try{
  const knexInstance = req.app.get("db");
const {topic_title, topic_content}= req.body
const newTopicFields={};

if(topic_title){
  newTopicFields.topic_title= topic_title
        }

if(topic_content){
  newTopicFields.topic_content= topic_content
        }
console.log("newTopicFields", newTopicFields)
const updatedTopic = await TopicService.updateTopic(knexInstance,req.params.topicId, newTopicFields)
console.log("updated Topic",updatedTopic)
res
.status(200)
.json(updatedTopic)
  }

  catch(error){
   console.log("patch topic error",error)
    next(error)
  }
})

.delete(async(req,res,next)=>{
  try{
  const knexInstance = req.app.get('db')
  await TopicService.deleteTopic(knexInstance,req.params.topicId)
  
    res.status(204).end()
  

}
catch(error){
console.log("delete thought error start",error,"delete thought error end")
  next(error)
}
}
)

topicRouter
  .route("/:topicId/level")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db')
    const topicId = Number(req.params.topicId)
    const userId = Number(req.user.id)
    try {
      const level = await TopicService.getTopicLevel(
        knexInstance,
        topicId,
        userId
      )
      if (!level) {
        return res.status(404).json({
          error: { message: `Error when finding shared topic in topic_connections.` }
        });
      }
      res.json(level)
    } catch(error) {
      console.log('get shared thought by id error', error)
      next(error)
    }
  })

  topicRouter
    .route('/share/:topicId')
    .post(jsonBodyParser, async (req, res, next) => {
      const knexInstance = req.app.get('db')
      console.log('post topic share firing!');
      try {
        const topicId = req.params.topicId
        const owner_id = req.user.id
        const { shared_userId, shared_level } = req.body

        const sharedTopic = {
          owner_id,
          shared_userId,
          topic_id : topicId,
          level: shared_level
        }

        TopicService.shareTopic(
          knexInstance,
          sharedTopic
        )
          .then(topicShared => {
            console.log(topicShared, 'response from sharedTopic service')
            // take the topic that was just posted in the topic_connections table
            // get its id and share level
            const topicId = topicShared.topic_id
            const topicLevel = topicShared.level
            // get all thoughts in that topic 
            // \/ !!!!!! \/ !!!!!!!!! \/ start here!
            const thoughtsInTopic = await TopicService.getAllThoughts(knexInstance, topicId)
            console.log(thoughtsInTopic, 'thoughts in topic')
            // post all thoughts with that topic id in thought_connections table to be the share level of that topic just added
            thoughtsInTopic.map(thought => {
              const thoughtToInsert = {
                owner_id,
                shared_userId,
                thought_id: thought.id,
                level: topicLevel
              }
              TopicService.insertSharedTopicThoughts(knexInstance, thoughtToInsert)
            })
          })
        res 
          .status(201)
          .json(sharedTopic)
      }
      catch (error) {
        console.log('topic router error sharing topic start', error, 'end of topic sharing error')
      next(error);
      }
    })

module.exports = topicRouter;
