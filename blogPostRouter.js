'use strict'

const express = require('express');                      //import express dependency
const router = express.Router();                         //create new express router instance

const bodyParser = require('body-parser');              //import body-parser dependency
const jsonParser = bodyParser.json();                   //parse json data sent by clients

const {BlogPosts} = require('./models');                //import BlogPosts data model




BlogPosts.create('WWE', 'I love the WWE', 'Taco', '7-21-18');
BlogPosts.create('Yankees', 'I love the Yankees', 'Taco')
BlogPosts.create('Fantasy Football', 'I love Fantasy Football', 'Taco')     //create original blog posts




router.get('/', (req, res) => {                                            //GET request - blog posts on server load
    res.json(BlogPosts.get());
});




router.post('/', jsonParser, (req, res) => {                              //POST request - create blog post
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(post);
});





router.delete('/:id', (req, res) => {                                     //DELETE request - remove blog post
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post ${req.params.id}`);
    res.status(204).end();
});





router.put('/:id', jsonParser, (req, res) => {                                        //PUT request - update blog post
    const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id) {
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    console.log(`Updating blog post ${req.params.id}`);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
});



module.exports = router;