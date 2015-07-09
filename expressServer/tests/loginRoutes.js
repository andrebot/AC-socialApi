var serverObject = require('../src/server');
var request = require('supertest');
var should = require('should');
var jwt = require('jsonwebtoken');
var User = require('./../src/schema/user.schema')
var testUser;


describe('Login Route', function(){
  var server;
  var serverConfig = serverObject.getServerConfig();
  var url = 'http://' + serverConfig.host + ':' + serverConfig.port;
  request = request(url);

  beforeEach(function(done){
    server = serverObject.makeServer(done);

    testUser = new User({ 
      "email": new Date().getTime() + "@mail.com",
      "password": "test",
      "name": "test",
      "role": "admin"
    });
    testUser.save();
  });

  afterEach(function(done){
   
    server.close(done);
     var res = User.findOneAndRemove(testUser._id);
    console.log('res: '+ JSON.stringify(res));
    console.log('removing user: '+ testUser.email);
  });

  it('should login successfully with right credentials', function(done){
    var user = {
      username: testUser.email,
      password: testUser.password
    };

    request.post('/login')
      .send(user)
    //  .expect(200)
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
      .send(user)
      .expect(403)
      .end(function(error, response){
        if(error) return done(error);

        done();
      });
  });

});