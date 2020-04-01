const express = require("express");
const path = require("path");
const xss = require("xss");
const ConnectionService = require("./thought-service")
const { requireAuth } = require("../middleware/jwt-auth");

const connectionRouter= express.Router()

connectionRouter
  .route("/")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = Number(req.user.id);
    console.log("user id", req.user.id);
    try {
      const connections = await ConnectionService.getAllConnections(
        knexInstance,
        userId
      );

      res.json(connections);
    } 
    catch (error) {
     console.log("get connections error",error)
        next(error);
    }
  })
