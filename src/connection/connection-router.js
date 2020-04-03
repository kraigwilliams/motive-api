const express = require("express");
const path = require("path");
const xss = require("xss");
const ConnectionService = require("./connection-service")
const { requireAuth } = require("../middleware/jwt-auth");

const connectionRouter= express.Router()

const jsonBodyParser = express.json();

connectionRouter
.use(requireAuth)

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

  connectionRouter
  .route('/:userId')
  .post(jsonBodyParser, async (req, res, next) => {
    const knexInstance = req.app.get('db')
    const userId = Number(req.user.id)
    try {
      const { connectionId } = req.body;

    const addedConnection = await ConnectionService.insertConnection(
      knexInstance, 
      userId, 
      connectionId
    )
    console.log(addedConnection, 'added connection')
      res.status(204)
    } catch(error) {
      console.log('connection router error adding connection start', error, 'end connection router error adding connection ')
      next(error);
    }
    
  })

  connectionRouter
  .route("/new")
  .get(async (req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = Number(req.user.id);
    console.log("user id", req.user.id);
    try {
      const connections = await ConnectionService.getNonConnections(
        knexInstance,
        userId
      );
console.log('final non connections',connections)
      res.json(connections);
    } 
    catch (error) {
     console.log("get connections error",error)
        next(error);
    }
  })

  module.exports= connectionRouter