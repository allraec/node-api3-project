const express = require('express');
const usersDB = require("./users-model")
const postsDB = require("../posts/posts-model")
const { validateUserId, validateUser, validatePost } = require("../middleware/middleware")
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  usersDB.get()
    .then((users) => {
      res.json(users)
    })
    .catch(() => {
      res.status(500).json({
        message: "Something went wrong",
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res) => {
  usersDB.insert(req.body)
    .then((users) => {
      res.status(201).json(users)
    })
    .catch(() => {
      res.status(500).json({
        message: "Something went wrong",
      })
    })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  usersDB.update(req.params.id, req.body)
    .then((count) => {
      if (count > 0){
        res.status(200).json(req.body)
      }else{
        res.status(404).json({
					message: "The user could not be found",
				})
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Something went wrong",
      })
    })

});

router.delete('/:id', validateUserId, (req, res) => {
  usersDB.remove(req.params.id)
    .then((count) => {
      if (count > 0){
        res.status(200).json({
					message: "The user has been nuked",
				})
      }else{
        res.status(404).json({
					message: "The user could not be found",
				})
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Something went wrong",
      })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  usersDB.getUserPosts(req.params.id)
    .then((posts) => {
      res.json(posts)
    })
    .catch(() => {
      res.status(500).json({
        message: "Something went wrong",
      })
    })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postItem = {user_id: req.params.id, text: req.body.text}
  postsDB.insert(postItem)
    .then(post => {
      postsDB.getById(post.id)
        .then(newPost => {
          console.log(newPost)
          res.json(newPost)
        })
    })
    .catch(err => {
      console.log(err)
    })
});

// do not forget to export the router

module.exports = router;