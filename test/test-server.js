'use strict'

const chai = require('chai');                                       //import chai dependencies
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');      //import app, runServer, & closeServer from server.js

const expect = chai.expect;                                        //activate chai's expect style syntax

chai.use(chaiHttp);                                                //allows testing of HTTP requests

describe('Blog Posts', function() {                               //describe entity to be tested and run callback function
    
    before(function() {                                           //before tests, run server
        return runServer();
    });

    after(function() {                                             //after tests, close server
        return closeServer();
    });

    //test GET
    it('should retrieve list of items on GET', function() { 
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
                });
            });
    });

    //test POST
    it('should create new item on POST', function() {
        const newItem = { title: "Miami Dolphins", content: "The dolphins suck", author:"Taco" };
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newItem, { id: res.body.id, publishDate: res.body.publishDate })
                );
            });
    });

    //test PUT
    it('should update item on PUT', function() {
        const updateData = { title: "Carbs", content: "Carbs are bad, mmkay", author: "Taco", publishDate: "11-27-18" };
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            }).then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    //test DELETE request
    it('should remove item on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
            }).then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});