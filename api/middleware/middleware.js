const Users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  const timestamp = Date().toLocaleString;
  console.log(`${req.method} ${req.originalUrl} ${timestamp}`);
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  Users.getById(req.params.id)
  .then(result=>{
    if (result ==null){
      res.status(404).json({message: 'user not found'})
      return;
    }
    req.user = result;
    next();
  })
  .catch(error =>{
    res.status(500).json({ message: 'there was an issue with the server '})
  })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  let {name} = req.body;
  if (name == null || name.trim() == ""){
    res.status(400).json({message: 'missing required name field'})
    return;
  }
  req.user = {name: name.trim()};
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  let { text } = req.body.text;
  if(text == null || text.trim() ==''){
    res.status(400).json({ message: 'missing required text field' })
    return;
  }
  req.text = {text: text.trim()};
  next();
}

// do not forget to expose these functions to other modules
module.exports ={
  logger,
  validateUserId,
  validateUser,
  validatePost
}