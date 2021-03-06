const express = require("express");
const path = require("path");
const xss = require("xss");
const ThoughtService = require("./thought-service");
const { requireAuth } = require("../middleware/jwt-auth");

const thoughtRouter = express.Router();

const jsonBodyParser = express.json();

const serializeThought = (thought) => ({
  id: Number(thought.id),
  thought_title: xss(thought.thought_title),
  thought_content: xss(thought.thought_content),
  thought_owner: Number(thought.thought_owner),
  thought_topic: Number(thought.thought_topic),
});

thoughtRouter.use(requireAuth);

thoughtRouter
  .route("/")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = req.user.id;

    try {
      const thoughts = await ThoughtService.getAllThoughts(
        knexInstance,
        Number(req.user.id)
      );

      res.json(thoughts.map(serializeThought));
    } catch (error) {
      next(error);
    }
  })

  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get("db");

    try {
      const { thought_title, thought_content, thought_topic } = req.body;

      const newThought = { thought_title, thought_content };

      for (const [key, value] of Object.entries(newThought)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` },
          });
        }
      }

      if (thought_topic == 0) {
        newThought.thought_topic = null;
      } else {
        newThought.thought_topic = thought_topic;
      }

      newThought.thought_owner = req.user.id;

      const createdThought = await ThoughtService.insertThought(
        knexInstance,
        newThought
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${createdThought.id}`))
        .json(createdThought);
    } catch (error) {
      console.log("/thought router error", error);
      next(error);
    }
  });

thoughtRouter.route("/shared").get(async (req, res, next) => {
  const userId = Number(req.user.id);
  try {
    const knexInstance = req.app.get("db");
    const sharedThoughts = await ThoughtService.getSharedThoughts(
      knexInstance,
      userId
    );
    res.json(sharedThoughts);
  } catch (error) {
    console.log(
      "get shared thoughts by user id error start",
      error,
      "get shared thoughts by user id error end"
    );
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
      if (!thought) {
        return res.status(404).json({
          error: { message: `This thought does not exist.` },
        });
      }
      res.json(thought);
    } catch (error) {
      console.log("get thought by Id error", error);
      next(error);
    }
  })

  .patch(jsonBodyParser, async (req, res, next) => {
    try {
      const knexInstance = req.app.get("db");
      const {
        thought_title,
        thought_content,
        thought_topic,
        date_modified,
      } = req.body;
      const newThoughtFields = {};

      if (thought_title) {
        newThoughtFields.thought_title = thought_title;
      }

      if (thought_topic == 0) {
        newThoughtFields.thought_topic = null;
      } else {
        newThoughtFields.thought_topic = thought_topic;
      }

      if (thought_content) {
        newThoughtFields.thought_content = thought_content;
      }

      if (date_modified) {
        newThoughtFields.date_modified = date_modified;
      }

      const updatedThought = await ThoughtService.updateThought(
        knexInstance,
        req.params.thoughtId,
        newThoughtFields
      );
      res.status(200).json(updatedThought);
    } catch (error) {
      console.log("patch thought error", error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const knexInstance = req.app.get("db");
      await ThoughtService.deleteThought(knexInstance, req.params.thoughtId);
      res.status(204).end();
    } catch (error) {
      console.log(
        "delete thought by id error start",
        error,
        "delete thought by id error end"
      );
      next(error);
    }
  });

thoughtRouter.route("/:thoughtId/level").get(async (req, res, next) => {
  const thoughtId = req.params.thoughtId;
  const knexInstance = req.app.get("db");
  const userId = Number(req.user.id);
  try {
    const level = await ThoughtService.getThoughtLevel(
      knexInstance,
      thoughtId,
      userId
    );

    if (!level) {
      return res.status(404).json({
        error: {
          message: `Error when finding shared thought in thought_connections.`,
        },
      });
    }
    res.json(level);
  } catch (error) {
    console.log("get shared thought by id error", error);
    next(error);
  }
});

thoughtRouter
  .route("/share/:thoughtId")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    try {
      thoughtId = req.params.thoughtId;

      const sharedUsers = await ThoughtService.getSharedUsersById(
        knexInstance,
        thoughtId
      );
      res.json(sharedUsers);
    } catch (error) {
      console.log("get shared users for a thought by id error", error);
      next(error);
    }
  })
  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get("db");

    try {
      const thoughtId = req.params.thoughtId;
      const owner_id = req.user.id;
      const { shared_userId, shared_level } = req.body;

      const sharedThought = {
        owner_id: owner_id,
        shared_userId: shared_userId,
        thought_id: thoughtId,
        level: shared_level,
      };

      ThoughtService.shareThought(knexInstance, sharedThought);
      res.status(201).json(sharedThought);
    } catch (error) {
      console.log(
        "thought router error sharing thought start",
        error,
        "end of thought sharing error"
      );
      next(error);
    }
  });

module.exports = thoughtRouter;
