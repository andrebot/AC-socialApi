var serverObject = require('../src/server'),
  request = require('supertest'),
  should = require('should'),
  jwt = require('jsonwebtoken'),
  User = require('./../src/schema/user.schema'),
  Friendship = require('./../src/schema/friendship.schema'),
  Mongo = require('mongodb'),
  ObjectID = Mongo.ObjectID,
  assert = require("assert"),
  userData = {
    "_id": new ObjectID(),  
    "email":  "12345@mail.com",
    "password": "test",
    "name": "test",
    "role": "admin"
  },
  userData2 = {
    "_id": new ObjectID(),  
    "email":  "abcd@mail.com",
    "password": "test2",
    "name": "test2",
    "role": "admin"
  },
  testUser = new User(userData),
  testUser2 = new User(userData2),
  friendship = new Friendship({
  	userRequested: testUser._id,
  	userRequester: testUser2._id
  }),
  validAdminPayload = {
    "_id": testUser._id,  
    "role": testUser.role
  };


describe('Friendship Route', function() {
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


  before(function (done) {
    server = serverObject.makeServer(done);
    testUser.save();
    testUser2.save();
	friendship.save();
  });

  after(function (done) {
  	Friendship.findOneAndRemove(testUser._id, function(err, data){
	    User.findOneAndRemove(testUser._id, function(err, data){
	    	User.findOneAndRemove(testUser2._id, function(err, data){

		        console.log('after friendships Routes');
		        server.close(done);
		    });
	    });
    });
    
  });

  it('should list all friendships if I have the right cookie', function(done){
    var token = getToken(validAdminPayload);

    request.get('/friendships')
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var friendships = response.body;
        friendships.should.not.be.empty;
        friendships.should.be.an.Array;

        done();
      });
  });
  
  it('should get friendship with id ' + friendship._id  +' using right cookie', function(done){
    var token = getToken(validAdminPayload);
    var idToTest = friendship._id;

    request.get('/friendships/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var friendshipResult = response.body;

        friendshipResult.should.not.be.empty;
        friendshipResult.should.have.properties('status', 'userRequested', 'userRequester', 'blockUserRequested', 'blockUserRequester', 'vipUserRequested', 'vipUserRequester');
        assert.equal(friendship.status, friendshipResult.status);
        assert.equal(friendship.blockUserRequested, friendshipResult.blockUserRequested);
        assert.equal(friendship.blockUserRequester, friendshipResult.blockUserRequester);
        assert.equal(friendship.vipUserRequested, friendshipResult.vipUserRequested);
        assert.equal(friendship.vipUserRequester, friendshipResult.vipUserRequester);
        assert.equal(friendship._id, friendshipResult._id);
        done();
      });
  });
});