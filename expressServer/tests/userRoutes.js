var serverObject = require('../src/server');
var request = require('supertest');
var should = require('should');
var jwt = require('jsonwebtoken');
var User = require('./../src/schema/user.schema')


describe('Users Route', function() {
  var server;
  var serverConfig = serverObject.getServerConfig();
  var url = 'http://' + serverConfig.host + ':' + serverConfig.port;
  var testUser;
  request = request(url);

  var getToken = function(payload){
    return jwt.sign(payload,
      serverConfig.secret,
      {
        issuer: serverConfig.issuer,
        expiresInMinutes: serverConfig.tokenExpiration
      });
  };

  var getInvalidToken = function(payload){
    return jwt.sign(payload,
      serverConfig.secret,
      {
        issuer: 'wrongIssuer',
        expiresInMinutes: serverConfig.tokenExpiration
      });
  };

  beforeEach(function (done) {
    server = serverObject.makeServer(done);

    testUser = new User({ 
      "email": new Date().getTime() + "@mail.com",
      "password": "test",
      "name": "test",
      "role": "admin"
    });
    testUser.save();
  });

  afterEach(function (done) {
    User.findOneAndRemove(testUser._id);
    server.close(done);
  });

  it('should list all users if I have the right cookie', function(done){
    var token = getToken(testUser);

    request.get('/users')
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var users = response.body;
        users.should.not.be.empty;
        users.should.be.an.Array;

        done();
      });
  });

});