require('dotenv').config()
const express = require('express')
const cors = require('cors');
const helmet = require('helmet')
const morgan = require('morgan')
const { CLIENT_ORIGIN, NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const authRouter = require('./auth/auth-router')
const topicRouter= require('./topic/topic-router')
const thoughtRouter= require('./topic/thought-router')

const app = express()
const { NODE_ENV } = require('./config')
const morganOption = (NODE_ENV=== 'production')
? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/topic', topicRouter)
app.use('/api/thought', thoughtRouter)
app.use('/api/user', userRouter)

// app.get('/',(req,res)=>{
// res.status(200).send("Hello World.")
// })

app.use(errorHandler)

module.exports = app;
