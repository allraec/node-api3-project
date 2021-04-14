const express = require('express');
const middleware = require('./middleware/middleware')
const usersRouter = require('./users/users-router')

const server = express();

server.use(middleware.logger)
// remember express by default cannot parse JSON in request bodies
server.use(express.json())
// global middlewares and the user's router need to be connected here
server.use(usersRouter)
module.exports = server;
