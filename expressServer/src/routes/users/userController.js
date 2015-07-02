var userDAO = require('../../persistent/userDAO');

var UserController = function () {
  this.listUsers = function(request, response) {
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
  };

  this.createUser = function(request, response) {
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
  };

  this.getLoggedUser = function(request, response) {
    var token = request.token;
    console.log('Getting user with #' + token._id);
    response.status(200).json(userDAO.getUser(token._id));
  };

  this.getUser = function(request, response) {
    var userId = request.params.userId;

    console.log('Getting User #' + userId);
    response.status(200).json(userDAO.getUser(userId));
  };

  this.deleteUser = function(request, response) {
    var userId = request.params.userId;

    console.log('Deleting User #' + userId);
    response.status(200).json(userDAO.deleteUser(userId));
  };

  this.changePassword = function(request, response) {
    var userId = request.params.userId;
    var data = request.body;

    if(userId && data && data.oldPassword && data.newPassword) {
      console.log('Changing User Password.');
      var user = userDAO.changePassword(userId, data.oldPassword, data.newPassword);
      if(user.password === data.newPassword){
        console.log('Password changed.');
        response.status(200).json({msg:'Password changed successfully'});
      } else {
        var errorMsg = 'Password did not change. Current password does not match.';
        console.log(errorMsg);
        response.status(403).send(errorMsg);
      }
    } else {
      var errorMsg = 'Could not change user\'s password. Wrong data.';
      console.log(errorMsg);
      response.status(403).send(errorMsg);
    }
  };
};

module.exports = new UserController();
