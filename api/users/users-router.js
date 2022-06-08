const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require('./users-model.js');
const Posts = require('../posts/posts-model.js');

const {validateUserId, validateUser, validatePost} = require('../middleware/middleware.js')

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then(user =>{
    res.status(200).json(user)
  }).catch(error =>{
    res.status(500).json({message: 'there was an issue with the server'});
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
  }
);

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.user)
  .then(user=>{
    res.status(201).json(user);
  }).catch (error =>{
    res.status(500).json({ message: 'there was an issue with the server'})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
  .then(user =>{
    res.status(200).json(user)
  }).catch(error =>{
    res.status(500).json({ message: 'there was an issue with the server'})
  })
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const deletedUser = await Users.getById(req.params.id);
  
  Users.remove(req.params.id)
  .then((user)=>{
    res.status(200).json(deletedUser)
  }).catch(error =>{
    res.status(500).json({message: 'there was an issue with the server'})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
  .then(posts =>{
    res.status(200).json(posts);
  }).catch(error =>{
    res.status(500).json({message: 'there was an issue with the server'})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert({ user_id: req.params.id, text: req.text })
  .then(post =>{
    res.status(201).json(post)
  }).catch(error =>{
    res.status(500).json({message: 'there was an issue with the server'})

  })
});

// do not forget to export the router
module.exports = router;