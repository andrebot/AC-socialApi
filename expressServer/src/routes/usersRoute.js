var express = require('express');
var router = express.Router();
var auth = require('../auth/authorization');
var userDAO = require('../persistent/userDAO');

console.log('Initializing user routes.');

router.route('/')
  .get(auth.isAuthenticated, function(request, response){
    var search = request.query.q;
    var users;

    if(search) {
      console.log('Getting users by name using query = ' + search);
      users = userDAO.searchUsersByName(search);
    } else {
      console.log('Getting all users.');
      users = userDAO.listAllUsers();
    }

    response.status(200).json(users);
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
    if(token) {
      console.log('Getting user with #' + token._id);
      response.status(200).json(userDAO.getUser(token._id));
    } else {
      var errorMsg = 'Could not get user. Missing token.';
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  });

router.route('/:userId')
  .get(auth.isAuthenticated, function(request, response){
    var userId = request.params.userId;

    if(userId) {
      console.log('Getting User #' + userId);
      response.status(200).json(userDAO.getUser(userId));
    } else {
      var errorMsg = 'Could not get user. Invalid ID: ' + userId;
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  })
  .delete(auth.hasRole('admin'), function(request, response){
    var userId = request.params.userId;

    if(userId) {
      console.log('Deleting User #' + userId);
      response.status(200).json(userDAO.deleteUser(userId));
    } else {
      var errorMsg = 'Could not delete user. User ID missing.';
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  });

router.route('/:userId/password')
  .put(auth.isAuthenticated, function(request, response){
    var userId = request.params.userId;
    var data = request.body;

    if(userId && data && data.oldPassword && data.newPassword) {
      console.log('Changing User Password.');
      var user = userDAO.changePassword(userId, data.oldPassword, data.newPassword);
      console.log('Password changed.');
      response.status(200).json({msg:'Password changed successfully'});
    } else {
      var errorMsg = 'Could not change user\'s password. Wrong data.';
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  });

module.exports = router;