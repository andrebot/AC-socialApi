var serverObject = require('../src/server'),
  request = require('supertest'),
  should = require('should'),
  jwt = require('jsonwebtoken'),
  User = require('./../src/schema/user.schema'),
  Mongo = require('mongodb'),
  ObjectID = Mongo.ObjectID,
  assert = require("assert")
  userData = { 
    "_id": new ObjectID("559fd352e4b04009d424521e"),  
    "email": "admin@mail.com",
    "password": "test",
    "name": "test",
    "role": "admin"
  }, 
  testUser = new User(userData),
  validAdminPayload = {
    "_id": testUser._id,  
    "role": testUser.role
  };



describe('Users Route', function() {
  var server;
  var serverConfig = serverObject.getServerConfig();
  var url = 'http://' + serverConfig.host + ':' + serverConfig.port;
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
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('should list all users if I have the right cookie', function(done){
    var token = getToken(validAdminPayload);

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

  it('should get current logged user using right cookie', function(done){
    
       var token = getToken(validAdminPayload);

    request.get('/users/me')
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties('name', 'email', '_id', 'role', 'password');
        assert.equal("test", user.name);
        assert.equal("559fd352e4b04009d424521e", user._id);
        assert.equal("admin", user.role);
        assert.equal("admin@mail.com", user.email);
        assert.equal("test", user.password);
        done();
      });
  });
  
  it('should get user with id ' + testUser._id  +' using right cookie', function(done){
    var token = getToken(validAdminPayload);
    var idToTest = testUser._id;

    request.get('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties('name', 'email', '_id', 'role', 'password');
        assert.equal("test", user.name);
        assert.equal("559fd352e4b04009d424521e", user._id);
        assert.equal("admin", user.role);
        assert.equal("admin@mail.com", user.email);
        assert.equal("test", user.password);
        done();
      });
  });


  it('should list all users that its name have \'te\' if I have the right cookie', function(done){
    var token = getToken(validAdminPayload);

    request.get('/users?q=te')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var users = response.body;
        users.should.not.be.empty;
        users.should.be.an.Array;
        users.should.matchEach(function(user){
          user.should.have.property('name');
          user.name.should.match(/te/i);
        });

        done();
      });
  });


});