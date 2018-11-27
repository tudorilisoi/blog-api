'use strict'

const express = require('express');                      //import express dependency
const morgan = require('morgan');                        //import morgan dependency

const app = express();                                   //create new express app instance

const blogPostRouter = require('./blogPostRouter');      //import blog post router

app.use(morgan('common'));                               //HTTP logger
app.use(express.static('public'));                       //serve public assets

app.use('/blog-posts', blogPostRouter);                  //route /blog-posts requests to router


app.listen(process.env.PORT || 8080, () => {             //listen for requests
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });