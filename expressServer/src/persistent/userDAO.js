'use strict';
var Promise = require('mpromise');
var User = require('./../schema/user.schema')

var UserDAO = function(){

  this.getUser = function(id) {
    console.log('MongoDB - Get User - findById('+ id+ ')');
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
    var query = User.findOneAndUpdate({ '_id': userId, 'password': oldPassword }, { $set: { password: newPassword } }, { 'new': true });
    return query.exec();
  };

  this.createUser = function(name, email, password, callback){
	  
    var newUser = new User({ name: name, email: email, password: password});	 
    var promise = new Promise;
	  newUser.provider = 'local';
	  newUser.role = 'user';
	  newUser.save(function(err){
      if(err) { promise.reject(err); return; }
      console.log('Mongoose - Schema - User created');
      promise.fulfill(newUser);
    });
    return promise;
  };

  this.deleteUser = function(userId) {	  
    console.log('MongoDB - User deleted - findOneAndRemove()');
    var query = User.findOneAndRemove(userId);
    return query.exec();
  };
};

module.exports = new UserDAO();