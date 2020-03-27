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
  thought_owner:Number(thought.thought_owner)

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
      const { thought_title, thought_content } = req.body;
      const newThought = { thought_title, thought_content };

      for (const [key, value] of Object.entries(newThought)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });
        }
      }
      console.log("thought user id", req.user.id)
      newThought.thought_owner = req.user.id;
      
console.log(newThought,"new thought")
      const createdThought = await ThoughtService.insertThought(knexInstance,newThought);
      
console.log("created thought",createdThought)
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${thought.id}`))

        .json(serializeThought(createdThought));
    } 
    catch (error) {
      next(error);
    }
  });

thoughtRouter.route("/:thoughtId").get(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = thoughtRouter;
