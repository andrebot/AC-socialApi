var userDAO = require('../../persistent/userDAO');


var UserController = function () { 
	
  this.listUsers = function(request, response) {
    var search = request.query.q;
    var promise;

    if(search) {
      console.log('Getting users by name using query = ' + search);
      promise = userDAO.searchUsersByName(search);
    } else {
      console.log('Getting all users.');
      promise = userDAO.listAllUsers();
    }

	  promise.then(function(data, err){
      if(data && !err){
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      } else {      
        console.log(err);
        response.status(403).send({error: errorMsg, data: data});
      }    
    });
  
  };

  this.createUser = function(request, response) {
    var data = request.body;
    console.log('Creating new user.');
    if(data) {      
      var promise = userDAO.createUser(data.name, data.email, data.password);

      promise.then(function(data){
        console.log('User created');
        console.log('Returning result: ' + data);
        response.status(200).json(data);   
      }, function(err){
        console.log(err);
        response.status(403).send({error: err, data: data});
      });
      
      
    } else {
      console.log('Error creating User.');
      response.status(403).send({error: 'Could not create user. Data malformed.', data: data});
    }
  };

  this.getLoggedUser = function(request, response) {
    
    var token = request.token;    
    console.log('Getting user with #' + token._id);

    var promise = userDAO.getUser(token._id);

    promise.then(function(data, err){
      
      if(data && !err){
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      } else {      
        console.log(err);
        response.status(403).send({error: err, data: data});
      }    
    });
  };

  this.getUser = function(request, response) {
    console.log('Getting User #' + userId);
    var userId = request.params.userId;
    var promise = userDAO.getUser(userId);
    promise.then(function(data, err){
      console.log('data :  '+ data);
      console.log('err :  '+ err);
      if(data && !err){
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      } else {      
        console.log(err);
        response.status(403).send({error: err, data: data});
      }    
    });
  };

  this.deleteUser = function(request, response) {
    var userId = request.params.userId;

    console.log('Deleting User #' + userId);
    
    var promise = userDAO.deleteUser(userId);
    
    promise.then(function(data, err){
      if(data && !err){
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      } else {      
        console.log(err);
        response.status(403).send({error: err, data: data});
      }    
    });
  };

  this.changePassword = function(request, response) {
    var userId = request.params.userId;
    var data = request.body;

    if(userId && data && data.oldPassword && data.newPassword) {
      console.log('Changing User Password.');
      var promise = userDAO.changePassword(userId, data.oldPassword, data.newPassword);
      promise.then(function(data, err){
        if(data && !err){
          console.log('Password changed.');
          response.status(200).json(data);
        } else {      
          console.log(err);
          response.status(403).send({error: err, data: data});
        }    
      });
    
    } else {
      var errorMsg = 'Could not change user\'s password. Wrong data.';
      console.log(errorMsg);
      response.status(403).send({error: errorMsg, data: data});
    }
  };
};

module.exports = new UserController();
