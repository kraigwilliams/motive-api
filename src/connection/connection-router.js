const express = require("express");
const ConnectionService = require("./connection-service");
const { requireAuth } = require("../middleware/jwt-auth");

const connectionRouter = express.Router();

const jsonBodyParser = express.json();

connectionRouter.use(requireAuth);

connectionRouter.route("/").get(async (req, res, next) => {
  const knexInstance = req.app.get("db");
  const userId = Number(req.user.id);

  try {
    const connections = await ConnectionService.getAllConnections(
      knexInstance,
      userId
    );

    res.json(connections);
  } catch (error) {
    console.log("get connections error", error);
    next(error);
  }
});

connectionRouter
  .route("/:userId")
  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = Number(req.user.id);
    try {
      const { connectionId } = req.body;

      const connections = await ConnectionService.getExistingConnections(
        knexInstance,
        userId
      );

      function isAdded(connect) {
        if (
          connect.receiver_id == connectionId &&
          connect.sender_id == userId
        ) {
          return true;
        } else if (
          connect.sender_id == connectionId &&
          connect.receiver_id == userId
        ) {
          return true;
        } else {
          return false;
        }
      }

      const alreadyAdded = connections.find(isAdded);

      if (alreadyAdded == undefined) {
        const addedConnection = await ConnectionService.insertConnection(
          knexInstance,
          userId,
          connectionId
        );
      }
      res.status(200).json("Succesfully added connection").end();
    } catch (error) {
      console.log(
        "connection router error adding connection start",
        error,
        "end connection router error adding connection "
      );
      next(error);
    }
  });

connectionRouter.route("/new").get(async (req, res, next) => {
  const knexInstance = req.app.get("db");
  const userId = Number(req.user.id);

  try {
    const connections = await ConnectionService.getNonConnections(
      knexInstance,
      userId
    );

    res.json(connections);
  } catch (error) {
    console.log("get connections error", error);
    next(error);
  }
});

module.exports = connectionRouter;
