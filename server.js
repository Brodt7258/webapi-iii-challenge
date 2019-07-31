const express = require('express');

const userRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter');

const server = express();

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/users', userRouter);
server.use('/posts', postsRouter);

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, Url: ${req.url}, Time: ${Date.now()}`);
  next();
};

module.exports = server;
