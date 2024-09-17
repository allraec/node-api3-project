const usersDB = require("../users/users-model")
const postsDB = require("../posts/posts-model")
function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`${req.method} request made by ${req.ip} at ${time}`)
  next()
}

function validateUserId(req, res, next) {
  const id = req.params.id
  usersDB.getById(id)
    .then(users => {
      if(users){
        req.user = users;
        next();
      }else{
        res.status(404).json({ message: "user not found" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Something went wrong",
      })
    })
}

function validateUser(req, res, next) {
  if(!req.body.name){
    res.status(400).json({ message: "missing required name field" })
  }else{
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body.text){
    res.status(400).json({ message: "missing required text field" })
  }else{
    next()
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}