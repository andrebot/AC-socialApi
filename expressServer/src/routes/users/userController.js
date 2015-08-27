var userDAO = require('../../persistent/userDAO'),
    friendshipDAO = require('../../persistent/friendshipDAO');


var UserController = function () { 
	
  this.listUsers = function(request, response) {
    var search = request.query.q;
    var list = request.query.list ? request.query.list.split(',') : null;
    var fail = function(error, data) {
      console.log('User Controller Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };

    if(search) {
      console.log('Getting users by name using query = ' + search);
      userDAO.searchUsersByName(search, success, fail);
    } else if(list) {
      console.log('Getting users by ids using query = ' + list);
      userDAO.listUsersById(list, success, fail);
    } else {
      console.log('Getting all users.');
      userDAO.listAllUsers(success, fail);
    }
  };

  this.createUser = function(request, response) {
    var data = request.body;
    var fail = function(error, data) {
      console.log(error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      console.log('User created');
      console.log('Returning result: ' + data);
      response.status(200).json(data);
    };

    console.log('Creating new user.');
    if(data) {
      userDAO.createUser(data, success, fail);
    } else {
      console.log('Error creating User.');
      response.status(403).send({error: 'Could not create user. Data malformed.', data: data});
    }
  };

  this.getLoggedUser = function(request, response) {
    var token = request.token;
    var fail = function(error, data){
      console.log(error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data){
      console.log('Returning result: ' + data);
      response.status(200).json(data);
    };
    console.log('Getting user with #' + token._id);

    userDAO.getUser(token._id, success, fail);
  };

  this.updateLoggedUser = function(request, response) {
    var data = request.body || {},
        token = request.token || {},
        id = token._id || 0;

    var fail = function(error, data) {
      console.log(error);
      response.status(403).send({error: error, data: data});
    };

    var success = function(data) {
      console.log('User profile updated');
      console.log('Returning result: ' + data);
      response.status(200).json(data);
    };

    console.log('Updating user profile.');

    if(id && data) {
      userDAO.updateUser(id, data, success, fail);
    } else {
      console.log('Error updating user profile.');
      response.status(403).send({error: 'Could not update user profile. Data malformed.', data: data});
    }
  }

  this.getUser = function(request, response) {
    var userId = request.params.userId;
    var fail = function(error) {
      if(error) {
        console.log('User Controller Error: ' + error);
        console.log('Returning empty result');
        response.status(200).json({});
      }
    };
    var success = function(data) {
      if(data) {
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      }
    };
    console.log('Getting User #' + userId);
    userDAO.getUser(userId, success, fail);
  };

  this.deleteUser = function(request, response) {
    var userId = request.params.userId;
    var fail = function(error){
      console.log(error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data){
      console.log('Returning result: ' + data);
      response.status(200).json(data);
    };

    console.log('Deleting User #' + userId);

    userDAO.deleteUser(userId, success, fail);
  };

  this.changePassword = function(request, response) {
    var userData = request.body;
    var fail = function(error, data){
      console.log(error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data){
      console.log('Password changed.');
      response.status(200).json(data);
    };

    userData._id = request.params.userId;

    if(userData._id && userData && userData.oldPassword && userData.newPassword) {
      console.log('Changing User Password.');
      userDAO.changePassword(userData, success, fail);
    } else {
      var errorMsg = 'Could not change user\'s password. Wrong data.';
      console.log(errorMsg);
      response.status(403).send({error: errorMsg});
    }
  };

  this.getAvailableFriends = function(request, response) {
    var token = request.token,
        userId = token._id;

    var fail = function(error, data){
      console.log(error);
      response.status(403).send({error: error, data: data});
    };

    var success = function(data){
      console.log('Returning result: ' + data);
      response.status(200).json(data);
    };

    var friendshipSuccess = function(friendshipUserIds) {
      userDAO.getAvailableFriends(userId, friendshipUserIds, success, fail);
    };

    console.log('Getting available users with #' + userId);
    friendshipDAO.getAllMyFriendshipIds(userId, friendshipSuccess, fail);
  };
};

module.exports = new UserController();
