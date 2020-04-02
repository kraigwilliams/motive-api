const express = require("express");
const path = require("path");
const xss = require("xss");
const ThoughtService = require("./thought-service")
const { requireAuth } = require("../middleware/jwt-auth");

const thoughtRouter = express.Router();

const jsonBodyParser = express.json();

const serializeThought = thought => ({
  id: Number(thought.id),
  thought_title: xss(thought.thought_title),
  thought_content: xss(thought.thought_content),
  thought_owner:Number(thought.thought_owner),
  thought_topic:Number(thought.thought_topic)
  

});

thoughtRouter
.use(requireAuth)

thoughtRouter
  .route("/")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = req.user.id;
    console.log("user id", req.user.id);
    try {
      const thoughts = await ThoughtService.getAllThoughts(
        knexInstance,
        Number(req.user.id)
      );

      res.json(thoughts.map(serializeThought));
    } 
    catch (error) {
      next(error);
    }
  })

  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get("db");

    try {
      const { thought_title, thought_content ,thought_topic} = req.body;
      
      const newThought = { thought_title, thought_content };

      for (const [key, value] of Object.entries(newThought)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });
        }
      }

      if(thought_topic == 0 ){
        newThought.thought_topic=null
      } else {
        newThought.thought_topic = thought_topic
      };
       
      console.log("thought user id", req.user.id)
      newThought.thought_owner = req.user.id;
      
      console.log(newThought,"new thought")
      const createdThought = await ThoughtService.insertThought(
        knexInstance,
        newThought
      );
      
      console.log("created thought",createdThought)
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${createdThought.id}`))
        .json(createdThought);
    } 
    catch (error) {
      console.log("/thought router error",error)
      next(error);
    }
  });


  thoughtRouter
  .route("/shared")
  .get(async (req, res, next) => {
    const userId = Number(req.user.id);
    try {
      const knexInstance = req.app.get('db');
      const sharedThoughts = await ThoughtService.getSharedThoughts(
        knexInstance, 
        userId
      ) 
      res.json(sharedThoughts)
    } 
    catch(error) {
      console.log("get shared thoughts by user id error start",error, "get shared thoughts by user id error end")
        next(error);
    }
  });

thoughtRouter
  .route("/:thoughtId")
  .get(async (req, res, next) => {
    try {
      const knexInstance = req.app.get("db");
      const thought = await ThoughtService.getById(
        knexInstance,
        Number(req.params.thoughtId)
      );
      //console.log("topic", topic, "then", req.params.thoughtId, "req.params");
      if (!thought) {
        return res.status(404).json({
          error: { message: `This thought does not exist.` }
        });
      }

      res.json(serializeThought(thought));
    } catch (error) {
      console.log("get thought by Id error",error)
      next(error);
    }
  })

  .patch(jsonBodyParser,async (req,res,next)=>{
    try{
    const knexInstance = req.app.get("db");
  const {thought_title, thought_content, thought_topic}= req.body
  const newThoughtFields={};

  if(thought_title){
    newThoughtFields.thought_title= thought_title
          }

  if(thought_topic){
    newThoughtFields.thought_topic= thought_topic
          }

  if(thought_content){
    newThoughtFields.thought_content= thought_content
          }
  console.log("newThoughtFields", newThoughtFields)
  const updatedThought = await ThoughtService.updateThought(knexInstance,req.params.thoughtId, newThoughtFields)
  console.log("updated Thought",updatedThought)
  res
  .status(200)
  .json(updatedThought)
    }

    catch(error){
    console.log("patch thought error",error)
      next(error)
    }
  })
  .delete(async( req,res,next)=>{
    try{
    const knexInstance = req.app.get('db')
    await ThoughtService.deleteThought(knexInstance,req.params.thoughtId)
    
      res.status(204).end()
    
  
  }
  catch(error){
    console.log("delete thought by id error start", error,"delete thought by id error end")
    next(error)
  }
})

thoughtRouter
  .route('/share/:thoughtId')
  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get('db');

    try {
      const thoughtId = req.params.thoughtId;
      const owner_id = req.user.id;
      console.log(thoughtId, 'thought id in share');
      const { shared_userId, shared_level } = req.body; 
      console.log(shared_userId, 'shared user id', shared_level, 'shared level');   

      const sharedThought = {
        owner_id: owner_id,
        shared_userId: shared_userId,
        thought_id: thoughtId, 
        level: shared_level
      }

      ThoughtService.shareThought(
        knexInstance,
        sharedThought
      )
      res
        .status(201)
        .json(sharedThought);
    } 
    catch (error) {
      console.log('thought router error sharing thought start', error, 'end of thought sharing error')
      next(error);
    }
  });

module.exports = thoughtRouter;
