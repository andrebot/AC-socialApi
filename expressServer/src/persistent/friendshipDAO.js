'use strict';
var Friendship = require('./../schema/friendship.schema');

var FriendshipDAO = function(){

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

  var _defaultQueryMyFriendship  = function(userId, friendId){
    return { 
      '$or': [ 
        '$and': [
          { 'userRequested': userId }, 
          { 'userRequester': friendId }
        ],
        '$and': [
          { 'userRequested': friendId }, 
          { 'userRequester': userId }
        ]
    ]};
  };

  this.getFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Get Friendship - findById(' + id + ')');
    Friendship.findById(id, _defaultQueryFunction(successCB, failCB));
  };

  this.getFriendshipByUserId = function(userId, successCB, failCB) {
    console.log('MongoDB - Get Friendship By User Id- find( userId: ' + id + ')');
    Friendship.find(id, _defaultQueryFunction(successCB, failCB));
  };  

  this.listAllFriendships = function(successCB, failCB) {
    console.log('MongoDB - List All Friendships - findById()');
    Friendship.find({}, _defaultQueryFunction(successCB, failCB));
  };

  this.listAllMyFriendships = function(successCB, failCB) {
    console.log('MongoDB - List All My Friendships - find()');
    Friendship.find(_defaultQueryMyFriendship, _defaultQueryFunction(successCB, failCB));
  };

  this.createFriendship = function(userData, successCB, failCB){
    var newFriendship = new Friendship({ });

    newFriendship.save(function(error){
      if(error) {
        failCB(error)
      } else {
        console.log('Mongoose - Schema - Friendship created');
        successCB(newFriendship);
      }
    });
  };

  this.deleteFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Friendship deleted - findOneAndRemove(' + id + ')');
    Friendship.findOneAndRemove(id, _defaultQueryFunction(successCB, failCB));
  };
};

module.exports = new FriendshipDAO();
