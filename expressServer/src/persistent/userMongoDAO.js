'use strict';

var User = require('./../schema/user.schema')

var UserDAO = function(){

  this.getUser = function(id) {
    console.log('MongoDB - Get User - findById()');
    var query = User.findById(id);
	  return query.exec();
  };

  this.listAllUsers = function() {
    console.log('MongoDB - List All Users - findById()');
    var query = User.find({});
	  return query.exec();
  };

  this.searchUsersByName = function(query) {
    console.log('MongoDB - Search users by name - find() by query');
    var querystring = query || '',
    searchRegExp = new RegExp('.*' + querystring + '.*', 'i'),
    criteria = {
       $or: [ 
        { name: searchRegExp }, 
        { email: searchRegExp } 
      ]
    };
	  var query = User.find(criteria);	
	  return query.exec();
  };

  this.getUserByEmailAndPassword = function(email, password) {
    console.log('MongoDB - Get User by Email and Password - findOne() by email and password');
    var query = User.findOne({ email: email, password: password});	
	  return query.exec();
  };

  this.changePassword = function(userId, oldPassword, newPassword) {
    console.log('MongoDB - changePassword - findOneAndUpdate()');
    debugger;
    var query = User.findOneAndUpdate({ '_id': userId, 'password': oldPassword }, { $set: { password: newPassword } }, { 'new': true });
    return query.exec();
  };

  this.createUser = function(name, email, password){
	  console.log('Mongoose - Schema - User created');
    var newUser = new User({ name: name, email: email, password: password});	 
	  newUser.provider = 'local';
	  newUser.role = 'user';
	  newUser.save();
    return newUser;
  };

  this.deleteUser = function(userId) {	  
    console.log('MongoDB - User deleted - findOneAndRemove()');
    var query = User.findOneAndRemove(userId);
    return query.exec();
  };
};

module.exports = new UserDAO();