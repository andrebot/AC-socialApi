var express = require('express');
var router = express.Router();
var auth = require('../auth/authorization');
var userDAO = require('../persistent/userMongoDAO');

console.log('Initializing user routes.');

router.route('/')
  .get(auth.isAuthenticated, function(request, response){
    var search = request.query.q;
    var promise;
    if(search) {
      console.log('Getting users by name using query = ' + search);
      promise = userDAO.searchUsersByName(search);
    } else {
      console.log('Getting all users.');
      promise = userDAO.listAllUsers();
    }
    promise.then(function(users){
      response.status(200).json(users);
    });
  })
  .post(function(request, response){
    var data = request.body;
    if(data && data.name && data.email && data.password) {
      console.log('Creating new user.');
      var newUser = userDAO.createUser(data.name, data.email, data.password);
      console.log('User created');
      response.status(201).json(newUser);
    } else {
      console.log('Error creating User.');
      response.status(403).send('Could not create user. Data malformed.');
    }
  });

router.route('/me')
  .get(auth.isAuthenticated, function(request, response){
    var token = request.token;
    console.log('Getting user with #' + token._id);
    var promise = userDAO.getUser(token._id);
    promise.then(function(user){
      response.status(200).json(user);
    });
  });

router.route('/:userId')
  .get(auth.isAuthenticated, function(request, response){
    var userId = request.params.userId;

    console.log('Getting User #' + userId);
    var promise = userDAO.getUser(userId);
    promise.then(function(user){
      response.status(200).json(user);
    });
  })
  .delete(auth.hasRole('admin'), function(request, response){
    var userId = request.params.userId;

    console.log('Deleting User #' + userId);
    var promise = userDAO.deleteUser(userId);
    promise.then(function(user){
      response.status(200).json(user);
    });
  });

router.route('/:userId/password')
  .put(auth.isAuthenticated, function(request, response){
    var userId = request.params.userId;
    var data = request.body;

    if(userId && data && data.oldPassword && data.newPassword) {
      console.log('Changing User Password.');
      var promise = userDAO.changePassword(userId, data.oldPassword, data.newPassword);;
      promise.then(function(user){
        if(user){
          console.log('Password changed.');
          response.status(200).json({msg:'Password changed successfully'});
        } else {
          var errorMsg = 'Password did not change. Current password does not match.';
          console.log(errorMsg);
          response.status(403).send(errorMsg);
        }
      });      
    } else {
      var errorMsg = 'Could not change user\'s password. Wrong data.';
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  });

module.exports = router;