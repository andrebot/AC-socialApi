var serverObject = require('../src/server'),
  request = require('supertest'),
  should = require('should'),
  jwt = require('jsonwebtoken'),
  User = require('./../src/schema/user.schema'),
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


  before(function (done) {
    server = serverObject.makeServer(done);
    testUser.save(function(err){});
  });

  after(function (done) {
    User.findOneAndRemove(testUser._id, function(err, data){
        console.log('after User Routes');
        server.close(done);
    });
    
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
        assert.equal(userData.name, user.name);
        assert.equal(userData.role, user.role);
        assert.equal(userData.email, user.email);
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
          assert.equal(userData.name, user.name);
          assert.equal(userData._id, user._id);
          assert.equal(userData.role, user.role);
          assert.equal(userData.email, user.email);
          assert.equal(userData.password, user.password);
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
          console.log('user: ' + JSON.stringify(user) );
          user.should.have.property('name');
          user.should.have.property('email');
          [ user.name, user.email].should.matchAny(/te/i);
        });

        done();
      });
  });

  it('should create an user with the right data', function(done){
    var newUser = {
    
    "email": new Date().getTime() + "remove@mail.com",
    "password": "test",
    "name": "test",
    "role": "user"
  };
    request.post('/users')
      .send(newUser)
      
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties(newUser);
        assert.equal(newUser.email, user.email);
        assert.equal(newUser.name, user.name);
        assert.equal(newUser.password, user.password);
        User.findOneAndRemove(user._id, function(err, data){
          console.log('user removed after created');
          done();
        });
      });
  });


  it('should not list all users if I don\'t have a cookie', function(done){
    request.get('/users').expect(407, done);
  });

  it('should not list all users if I have an invalid cookie', function(done){
    var token = getInvalidToken(validAdminPayload);

    request.get('/users')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(407, done);
  });

  it('should not get any user if I don\'t have a cookie', function(done){
    request.get('/users/me').expect(407, done);
  });

  it('should not get user by ID if I don\'t have a cookie', function(done){
    var idToTest = 0;

    request.get('/users/' + idToTest).expect(407, done);
  });

  it('should get an empty object if there is no user with the ID requested', function(done){
    var token = getToken(validAdminPayload);
    var idToTest = 'errado';

    request.get('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;
        user.should.be.empty;

        done();
      });
  });

  it('should not list any users that its name have \'an\' if I have don\'t have a cookie', function(done){
    request.get('/users?q=an').expect(407, done);
  });

  it('should return an empty array if nothing matches search parameter if I have the right cookie', function(done){
    var token = getToken(validAdminPayload);

    request.get('/users?q=shdajshdjahsgdjhasgdjahsgdajhsdgjashdg')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var users = response.body;
        users.should.be.an.Array;
        users.should.have.lengthOf(0);

        done();
      });
  });

  it('should not create an user with the wrong email', function(done){
    var newUser = {
      name: 'testUser',
      email: '',
      password: 'meuPassword'
    };

    request.post('/users').send(newUser).expect(403, done);;
  });

  it('should not create an user with the no password', function(done){
    var newUser = {
      name: 'testUser',
      email: 'test@tester.com',
      password: ''
    };

    request.post('/users').send(newUser).expect(403, done);;
  });

  it('should not create an user with no name', function(done){
    var newUser = {
      name: '',
      email: 'test@tester.com',
      password: 'meuPassword'
    };

    request.post('/users').send(newUser).expect(403, done);
  });

  it('should not delete an user if I not an admin', function(done){
    var token = getToken({_id: 1, role: 'user'});
    var idToTest = userData._id;

    request.delete('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(407, done);
  });

  it('should not delete an user if I submitted wrong ID and should return an empty object', function(done){
    var token = getToken(validAdminPayload);
    var idToTest = "errado";

    request.delete('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;
        user.should.be.empty;

        done();
      });
  });

  it('should not delete an user if I don\'t have a cookie', function(done){
    var idToTest = 1;

    request.delete('/users/' + idToTest)
      .expect(407, done);
  });

  it('should not change the user\'s password if I don\'t have a cookie', function(done){
    var passwordData = {
      oldPassword: 'theasdf123',
      newPassword: 'hahahaha'
    };

    request.put('/users/'+ validAdminPayload._id + '/password')
      .send(passwordData)
      .expect(407, done);
  });

  it('should not change the user\'s password if I the old password does not match the current password', function(done){
    var token = getToken(validAdminPayload);
    var passwordData = {
      oldPassword: 'errado',
      newPassword: 'pelotas'
    };

    request.put('/users/'+ validAdminPayload._id + '/password')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .send(passwordData)
      .expect(403, done);
  });

  it('should not change the user\'s password if new password is missing', function(done){
    var token = getToken(validAdminPayload);
    var passwordData = {
      oldPassword: 'errado',
      newPassword: ''
    };

    request.put('/users/'+ validAdminPayload._id + '/password')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .send(passwordData)
      .expect(403, done);
  });
});