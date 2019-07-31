const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try {
    const data = await userDb.insert(req.body);
    res.status(201).json(data);
  } catch(err) {
    res.status(500).json(err);  
  }  
});

router.post('/:id/posts', validatePost, async (req, res) => {
  try {
    const post = await postDb.insert(req.body);
    res.status(201).json(post);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userDb.getById(id);
    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: "invalid user id" })
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const { id } = req.user;
    const userPosts = await userDb.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch(err) {
    res.status(500).json(err);
  }
  
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const { id } = req.user;
    await userDb.remove(id);
    res.send(200).end();
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/:id', validateUserId, async (req, res) => {
  try {
    const { id } = req.user;
    await userDb.update(id, req.body);
    res.status(200).json({
      id,
      ...req.body
    });
  } catch(err) {
    res.status(500).json(err);
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await userDb.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch(err) {
    res.status(500).json(err);
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

async function validatePost(req, res, next) {
  const { body } = req;

  if (!body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!body.text || !body.user_id) {
    res.status(400).json({ message: "missing required text field" });
  }

  try {
    const user = await userDb.getById(body.user_id);
    if (user) {
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch(err) {
    res.status(500).json(err);
  }
  

  
};

module.exports = router;
