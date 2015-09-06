var serverObject = require('../src/server');
var request = require('supertest');
var should = require('should');
var jwt = require('jsonwebtoken');
var User = require('./../src/schema/user.schema');
var testData = {
    email: 'admin@mail.com',
    password: 'test'
  }, testUser = new User(testData);

testUser.save();

describe('Login Route', function(){
  var server;
  var serverConfig = serverObject.getServerConfig();
  var url = 'http://' + serverConfig.host + ':' + serverConfig.port;
  request = request(url);

  before(function(done){
    server = serverObject.makeServer(done);
  });

  after(function(done){
    User.findOneAndRemove(testUser._id, function(err, data){
        console.log('after Login Routes');
        server.close(done);
    });
  });

  it('should login successfully with right credentials', function(done){
    var user = {
      username: testUser.email,
      password: testUser.password
    };

    request.post('/login')
      .send(user)
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        response.body.should.not.be.empty;

        var verify = jwt.verify(response.body, serverConfig.secret, {issuer: serverConfig.issuer, ignoreExpiration: false});
        verify.should.have.properties('_id', 'role', 'iat', 'exp', 'iss');

        done();
      });
  });

  it('should return status 403 for wrong credentials', function(done){
    var user = {
      username: 'blablalba@hotmail.com',
      password: 'theasdf123'
    };

    request.post('/login')
      .send(user).expect(403, done);
  });

});