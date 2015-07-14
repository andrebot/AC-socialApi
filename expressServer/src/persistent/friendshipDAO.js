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

  var _defaultQueryFriendshipInOrder  = function(userId, friendId){
    return { 
      '$or': [ 
        '$and': [
          { 'userRequested': userId }, 
          { 'userRequester': friendId }
        ]
    ]};
  };

  var _defaultQueryFriendshipNonOrdered  = function(userId, friendId){
    var _query = _defaultQueryFriendshipInOrder(userId, friendId);
    _query['$or'].push({
      '$and': [
        { 'userRequested': friendId }, 
        { 'userRequester': userId }
      ]
    });
    return _query;
  };
  

  var _defaultQueryMyFriendship  = function(userId){
    return { 
      '$or': [ 
        '$and': [
          { 'userRequested': userId }
        ],
        '$and': [
          { 'userRequester': userId }
        ]
    ]};
  };

  this.getFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Get Friendship - findById(' + id + ')');
    Friendship.findById(id, _defaultQueryFunction(successCB, failCB));
  };

  this.getFriendshipByUserId = function(userId, friendId, successCB, failCB) {
    console.log('MongoDB - Get Friendship By User Id- find( userId: ' + id + ')');
    Friendship.find(_defaultQueryFriendship(userId, friendId), _defaultQueryFunction(successCB, failCB));
  };  

  this.listAllFriendships = function(successCB, failCB) {
    console.log('MongoDB - List All Friendships - findById()');
    Friendship.find({}, _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };

  this.listAllMyFriendships = function(userId, successCB, failCB) {
    console.log('MongoDB - List All My Friendships - find()');
    Friendship.find(_defaultQueryMyFriendship(userId), _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };

  this.createFriendship = function(userId, friendId, successCB, failCB){
    var newFriendship = new Friendship({ 
      userRequested: userId,
      userRequester:  friendId,
    });

    newFriendship.save(function(error){
      if(error) {
        failCB(error)
      } else {
        console.log('Mongoose - Schema - Friendship created');
        successCB(newFriendship);
      }
    });
  };

   this.updateFriendshipStatus = function(id, status, successCB, failCB){
    User.findOneAndUpdate({ '_id': id },
                          { $set: { status: status } }
                          _defaultQueryFunction(successCB, failCB));
  };

  this.updateFriendshipBlockStatus = function(userId, friendId, block,successCB, failCB){
    User.findOneAndUpdate(_defaultQueryFriendshipInOrder,
                          { $set: { blockUserRequester: block } }// Change to add logic to check who is the requester and who is the requested
                          _defaultQueryFunction(successCB, failCB));
  };

  this.updateFriendshipVipStatus = function(userId, friendId, vip,successCB, failCB){
    User.findOneAndUpdate(_defaultQueryFriendshipInOrder,
                          { $set: { vipUserRequester: vip } } // Change to add logic to check who is the requester and who is the requested
                          _defaultQueryFunction(successCB, failCB));
  };


  this.acceptFriendship = function(id, successCB, failCB){
    this.updateFriendshipStatus(id, 1, successCB, failCB);
  };

  this.rejectFriendship = function(id, successCB, failCB){
    this.updateFriendshipStatus(id, 2, successCB, failCB);
  };

  this.blockFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendshipBlockStatus(userId, friendId, true, successCB, failCB);
  };

  this.unblockFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendshipBlockStatus(userId, friendId, false, successCB, failCB);
  };

  this.vipFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendshipVipStatus(userId, friendId, true, successCB, failCB);
  };

  this.unvipFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendshipVipStatus(userId, friendId, false, successCB, failCB);
  };

 
  this.deleteFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Friendship deleted - findOneAndRemove(' + id + ')');
    Friendship.findOneAndRemove(id, _defaultQueryFunction(successCB, failCB));
  };
};

module.exports = new FriendshipDAO();
