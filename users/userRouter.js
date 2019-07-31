const express = require('express');
const db = require('./userDb');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try {
    const data = await db.insert(req.body);
    res.status(201).json(data);
  } catch(err) {
    res.status(500).json(err);  
  }  
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await db.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
  
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.body;
  try {
    const user = await db.getById(id)
    req.user = user;
    next();
  } catch(err) {
    res.status(400).json({ message: "invalid user id" });
  }
};

function validateUser(req, res, next) {
  const { body } = req;

  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  next();
};

function validatePost(req, res, next) {

};

module.exports = router;
