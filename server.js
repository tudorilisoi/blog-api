'use strict'

const express = require('express');                      //import express dependency
const morgan = require('morgan');                        //import morgan dependency

const app = express();                                   //create new express app instance

const blogPostRouter = require('./blogPostRouter');      //import blog post router

app.use(morgan('common'));                               //HTTP logger
app.use(express.static('public'));                       //serve public assets

app.use('/blog-posts', blogPostRouter);                  //route /blog-posts requests to router




let server;                                              //declare server object

function runServer() {                                   //starts server & returns a promise for testing
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('Error', (err) => {
      reject(err);
    });
  });
}

function closeServer() {                                //closes server & returns a promise
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {                  //allows us to call runServer if module is being called by node server.js
  runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };