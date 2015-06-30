'use strict';

var User = require('./../schema/user.schema')

var UserDAO = function(){

  this.getUser = function(id) {
    var cursor = User.findById(id);
		debugger;
	return cursor;
  };

  this.listAllUsers = function() {
    var cursor = User.find({});
	debugger;
	return cursor;
  };

  this.searchUsersByName = function(query) {
    var querystring = query || '',
    searchRegExp = new RegExp('.*' + querystring + '.*', 'i'),
    criteria = {
       $or: [ 
        { name: searchRegExp }, 
        { email: searchRegExp } 
      ]
    };
	var cursor = User.find(criteria);
	debugger;
	return cursor;
  };

  this.getUserByEmailAndPassword = function(email, password) {
    var cursor = User.findOne({ email: email, password: password});
	debugger;
	return cursor;
  };

  this.changePassword = function(userId, oldPassword, newPassword) {
	  debugger;
    User.findById(userId, function (err, user) {
      if(user && user.password === oldPassword) {
        user.password = newPassword;
      }
    });
  };

  this.createUser = function(name, email, password){
	var newUser = new User({ name: name, email: email, password: password});
	debugger;
	newUser.provider = 'local';
	newUser.role = 'user';
	newUser.save(function(err, user) {
		if (err) return err;
		return newUser;
	});
  };

  this.deleteUser = function(userId) {
	  debugger;
    User.findOneAndRemove(userId);
  };
};

module.exports = new UserDAO();