var config = require('../config.js');
var jwt = require('jsonwebtoken');

var Auth = function() {
  var verifyAuth = function(request) {
    var cookie = request.cookies[config.cookieName];
    var authHeader;
    if (request.headers.authorization) {
        authHeader = request.headers.authorization.split(' ');
        if(authHeader.length === 2 && authHeader[0] === 'bearer') {
            authHeader = authHeader[1];
        }
    }
    var token = cookie || authHeader;
    if(token) {
      try {
        request.token = jwt.verify(token, config.secret, {issuer: config.issuer, ignoreExpiration: false});
        return true;
      } catch(error) {
        console.log('Request unauthorized. Error decoding token.');
        return false;
      }
    } else {
      console.log('Request unauthorized. No token available.');
      return false;
    }
  };

  this.isAuthenticated = function(request, response, next){

    if(verifyAuth(request)) {
      next();
    } else {
      response.sendStatus(401);
    }
  };

  this.hasRole = function(role) {
    return function(request, response, next) {
      if(verifyAuth(request)) {
        var token = request.token;
        if(token.role === role) {
          next();
        } else {
          console.log('Request unauthorized. Wrong role.');
          response.sendStatus(407);
        }
      } else {
        response.sendStatus(407);
      }
    }
  };

  this.signToken = function(payload) {
    return jwt.sign(payload, config.secret, {issuer: config.issuer, expiresInMinutes: config.tokenExpiration});
  };
};

module.exports = new Auth();