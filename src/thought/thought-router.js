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
  // thought_topic:Number(thought.thought_topic)
  

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
      if(thought_topic){
        newThought.thought_topic=thought_topic 
       }
       
      console.log("thought user id", req.user.id)
      newThought.thought_owner = req.user.id;
      
console.log(newThought,"new thought")
      const createdThought = await ThoughtService.insertThought(knexInstance,newThought);
      
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
console.log("newThoughtFields", newThoughFields)
const updatedThought = await ThoughtService.updateThought(knexInstance,req.params.thoughtId, newThoughtFields)
res
.status(204)
.json(updatedThought)
  }
  catch(error){
   console.log("patch thought error",error)
    next(error)
  }
})


module.exports = thoughtRouter;
