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

      console.log(connectionId, 'connection id from req body')
      const connections = await ConnectionService.getExistingConnections(
        knexInstance, 
        userId
      )

      console.log(connections, 'connections to filter through')
      const alreadyAdded = connections.filter(connect => {
       if ((connect.receiver_id == connectionId 
        && connect.sender_id == userId) ||  
       (connect.sender_id == connectionId 
        && connect.receiver_id == userId)) {
          return true;
        } else {
          return false;
        }
      })

      // let filter1 = {
      //   receiver_id: connectionId,
      //   sender_id:  userId
      // }
      // let filter2 = {
      //   receiver_id: userId,
      //   sender_id:  connectionId
      // }
      // const alreadyAdded = connections.filter(function(connect) {
      //   for (let key in filter1) {
      //     if (connect[key] != filter1[key]) {
      //         return false;
      //       } else {
      //         return true
      //       }
      //   }
      //  })
      console.log(alreadyAdded, 'already added connections')

      if(!alreadyAdded) {
        const addedConnection = await ConnectionService.insertConnection(
          knexInstance, 
          userId, 
          connectionId
        )
        console.log(addedConnection, 'added connection')
      }
      res.status(200)
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