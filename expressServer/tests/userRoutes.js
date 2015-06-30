var serverObject = require('../src/server');
var request = require('supertest');
var should = require('should');
var jwt = require('jsonwebtoken');

describe('Users Route', function() {
  var server;
  var adminUser = {_id: 0, role: 'admin'};
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
    var token = getToken(adminUser);

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
    var token = getToken(adminUser);

    request.get('/users/me')
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties('name', 'email', 'id');

        done();
      });
  });

  it('should get user with id 0 using right cookie', function(done){
    var token = getToken(adminUser);
    var idToTest = 0;

    request.get('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties('name', 'email', 'id');
        user.should.have.property('id', idToTest);

        done();
      });
  });

  it('should list all users that its name have \'an\' if I have the right cookie', function(done){
    var token = getToken(adminUser);

    request.get('/users?q=an')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var users = response.body;
        users.should.not.be.empty;
        users.should.be.an.Array;
        users.should.matchEach(function(user){
          user.should.have.property('name');
          user.name.should.match(/an/i);
        });

        done();
      });
  });

  it('should create an user with I have the right data', function(done){
    var newUser = {
      name: 'testUser',
      email: 'test@tester.com',
      password: 'meuPassword'
    };

    request.post('/users')
      .send(newUser)
      .expect(201)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties(newUser);

        done();
      });
  });

  it('should delete an user with id 0 if I have the right cookie', function(done){
    var token = getToken(adminUser);
    var idToTest = 1;

    request.delete('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;

        user.should.not.be.empty;
        user.should.have.properties('name', 'email', 'id');
        user.should.have.property('id', idToTest);

        done();
      });
  });

  it('should change the user\'s password if I have the right credentials', function(done){
    var token = getToken(adminUser);
    var passwordData = {
      oldPassword: 'theasdf123',
      newPassword: 'hahahaha'
    };

    request.put('/users/'+ adminUser._id + '/password')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .send(passwordData)
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        var user = response.body;
        user.should.not.be.empty;
        user.should.have.property('msg');

        done();
      });
  });

  it('should not list all users if I don\'t have a cookie', function(done){
    request.get('/users').expect(407, done);
  });

  it('should not list all users if I have an invalid cookie', function(done){
    var token = getInvalidToken(adminUser);

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
    var token = getToken(adminUser);
    var idToTest = 2;

    request.get('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + '=' + token])
      .expect(200)
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
    var token = getToken(adminUser);

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

  it('should not create an user with the no name', function(done){
    var newUser = {
      name: '',
      email: 'test@tester.com',
      password: 'meuPassword'
    };

    request.post('/users').send(newUser).expect(403, done);;
  });

  it('should not delete an user if I not an admin', function(done){
    var token = getToken({_id: 1, role: 'user'});
    var idToTest = 1;

    request.delete('/users/' + idToTest)
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .expect(407, done);
  });

  it('should not delete an user if I submitted wrong ID and should return an empty object', function(done){
    var token = getToken(adminUser);
    var idToTest = 1091898;

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

    request.put('/users/'+ adminUser._id + '/password')
      .send(passwordData)
      .expect(407, done);
  });

  it('should not change the user\'s password if I the old password does not match the current password', function(done){
    var token = getToken(adminUser);
    var passwordData = {
      oldPassword: 'errado',
      newPassword: 'pelotas'
    };

    request.put('/users/'+ adminUser._id + '/password')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .send(passwordData)
      .expect(403, done);
  });

  it('should not change the user\'s password if I new password is missing', function(done){
    var token = getToken(adminUser);
    var passwordData = {
      oldPassword: 'errado',
      newPassword: ''
    };

    request.put('/users/'+ adminUser._id + '/password')
      .set('Cookie', [serverConfig.cookieName + "=" + token])
      .send(passwordData)
      .expect(403, done);
  });
});