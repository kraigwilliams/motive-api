const express = require("express");
const path = require("path");
const xss = require("xss");
const CommentService = require("./comment-service");
const { requireAuth } = require("../middleware/jwt-auth");

const commentRouter = express.Router();

const jsonBodyParser = express.json();

const serializeComment = (comment) => ({
  id: Number(comment.id),
  comment_content: xss(comment.comment_content),
  commenter_id: Number(comment.commenter_id),
  date_posted: Number(comment.date_posted),
  thought_id: Number(comment.thought_id),
});

commentRouter.use(requireAuth);

commentRouter
  .route("/:thoughtId")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = Number(req.user.id);
    const thoughtId = Number(req.params.thoughtId);

    try {
      const comments = await CommentService.getComments(
        knexInstance,
        thoughtId
      );

      res.json(comments);
    } catch (error) {
      console.log("Get comments error", error);
      next(error);
    }
  })

  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const commenter_id = req.user.id;
    const thought_id = Number(req.params.thoughtId);
    try {
      const { comment_content } = req.body;

      const newComment = { comment_content, thought_id, commenter_id };

      for (const [key, value] of Object.entries(newComment)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` },
          });
        }
      }

      const createdComment = await CommentService.insertComment(
        knexInstance,
        newComment
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${createdComment.id}`))

        .json(createdComment);
    } catch (error) {
      console.log(" post comment error", error);
      next(error);
    }
  });

module.exports = commentRouter;
