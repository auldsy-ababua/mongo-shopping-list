console.log("hi!");
global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create(
              {
                name: 'Broad beans'
              },
              {
                name: 'Tomatoes'
              },
              {
                name: 'Peppers'
              },
              function() {
                done();
            });
        });
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Peppers');
                res.body[2].name.should.equal('Tomatoes');
                done();
            });
    });

    it('should edit an item on PUT', function(done){
        var id;
          Item.findOne({"name": "Broad beans"}, function (err, item) {
            id = item._id;
            if (err) {console.log(err)};
            chai.request(app)
                .put('/items/' + id)
                .send({
                    'name': 'Colin'
                })
                .end(function(err, res) {
                  res.should.have.status(200);
                  should.equal(err, null);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
                  res.body.name.should.be.a('string');
                  res.body.name.should.equal('Colin');
                  /*storage.items.should.be.a('array');
                  storage.items.should.have.length(4);
                  storage.items[0].should.be.a('object');
                  storage.items[0].should.have.property('id');
                  storage.items[0].should.have.property('name');
                  storage.items[0].id.should.be.a('number');
                  storage.items[0].name.should.be.a('string');
                  storage.items[0].name.should.equal('Colin');*/
                  done();
                });
          })

    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({
                'name': 'Kale'
            })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                /*storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');*/
                done();
            });
    });

    it('should delete an item on DELETE', function(done){
      var id;
        Item.findOne({}, function (err, item) {
          id = item._id;
          if (err) {console.log(err)};
        chai.request(app)
            .delete('/items/' + id)
            .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(210);
              /*storage.items.should.be.a('array');
              storage.items.should.have.length(3);
              storage.items[1].should.be.a('object');
              storage.items[1].should.have.property('id');
              storage.items[1].should.have.property('name');
              storage.items[1].id.should.be.a('number');
              storage.items[1].name.should.be.a('string');
              storage.items[1].name.should.equal('Peppers');*/
              done();
            });
          });
    });

    it('should send a 404 error on DELETE of nonexistent id', function(done){
      chai.request(app)
        .delete('/items/5')
        .end(function(err,res) {
          res.should.have.status(404);
          done();
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});
