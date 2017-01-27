'use strict';
var _ = require('lodash'),
    config = require('../config'),
    User = require('./../schema/user.schema');

var UserDAO = function(){

  var _defaultQueryFunction = function(successCB, failCB){
    var defaultFunction = function(error, data){
      if(data && !error) {
        successCB(data);
      } else {
        failCB(error, data);
      }
    };

    return defaultFunction;
  };

  this.getUser = function(id, successCB, failCB) {
    console.log('MongoDB - Get User - findById(' + id + ')');
    User.findById(id, _defaultQueryFunction(successCB, failCB));
  };

  this.listAllUsers = function(successCB, failCB) {
    console.log('MongoDB - List All Users - findById()');
    User.find({}, _defaultQueryFunction(successCB, failCB));
  };

  this.listUsersById = function(usersIds, successCB, failCB) {
    console.log('MongoDB - List Users by IDs - find()');
    User.find({ _id: { $in: usersIds}}, _defaultQueryFunction(successCB, failCB));
  };

  this.searchUsersByName = function(query, successCB, failCB) {
    console.log('MongoDB - Search users by name - find() by query');
    var querystring = query || '',
    searchRegExp = new RegExp('.*' + querystring + '.*', 'i'),
    criteria = {
       $or: [ 
        { name: searchRegExp }, 
        { email: searchRegExp } 
      ]
    };
	User.find(criteria, _defaultQueryFunction(successCB, failCB));
  };

  this.getUserByEmailAndPassword = function(userData, successCB, failCB) {
    console.log('MongoDB - Get User by Email and Password - findOne() by email: ' + userData.username + ' and password: ' + userData.password);
    User.findOne({ email: userData.username, password: userData.password}, _defaultQueryFunction(successCB, failCB));
  };

  this.changePassword = function(userData, successCB, failCB) {
    console.log('MongoDB - changePassword - findOneAndUpdate()');
    User.findOneAndUpdate({ '_id': userData._id, 'password': userData.oldPassword },
                          { $set: { password: userData.newPassword } },
                          { 'new': true },
                          _defaultQueryFunction(successCB, failCB));
  };

  this.createUser = function(userData, successCB, failCB){
    var newUser = new User({ name: userData.name,
                             email: userData.email,
                             password: userData.password});

    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function(error){
      if(error) {
        failCB(error);
      } else {
        console.log('Mongoose - Schema - User created');
        successCB(newUser);
      }
    });
  };

  this.updateUser = function(id, userData, successCB, failCB) {
    userData = _.pick(userData, ['name', 'email']);

    console.log('MongoDB - updateUser - findOneAndUpdate()');
    User.findOneAndUpdate({ '_id': id },
                          { $set: userData },
                          { 'new': true },
                          _defaultQueryFunction(successCB, failCB));
  };

  this.getAvailableFriends = function(userId, friendshipUserIds, successCB, failCB) {
    console.log('MongoDB - Get Available Users - find()');

    var invalidUserIds = _.clone(friendshipUserIds);
    invalidUserIds.push(userId);
    
    User
      .find({ _id: { $nin: invalidUserIds}})
      .select('name email')
      .limit(config.availableFriendsLimit).
      exec(_defaultQueryFunction(successCB, failCB));
  };

  this.deleteUser = function(userId, successCB, failCB) {
    console.log('MongoDB - User deleted - findOneAndRemove(' + userId + ')');
    User.findOneAndRemove(userId, _defaultQueryFunction(successCB, failCB));
  };
};

module.exports = new UserDAO();
