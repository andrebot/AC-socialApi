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
     '$and': [
        { 'userRequested': userId }, 
        { 'userRequester': friendId }
     ]
    };
  };

  var _defaultQueryFriendshipNonOrdered  = function(userId, friendId){
    var _defaultQuery = _defaultQueryFriendshipInOrder(userId, friendId);
    var _defaultInverseQuery = _defaultQueryFriendshipInOrder(friendId, userId);
    var _query = {
      '$or' : [
        _defaultQuery,
        _defaultInverseQuery
      ]
    };
    return _query;
  };
  

  var _defaultQueryMyFriendship  = function(userId){
    return { 
      '$or': [ 
        { 'userRequested': userId },
        { 'userRequester': userId }        
      ]
    };
  };

  this.getFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Get Friendship - findById(' + id + ')');
    Friendship.findById(id, _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };

  this.getFriendshipByUserId = function(userId, friendId, successCB, failCB) {
    console.log('MongoDB - Get Friendship By User Id and FriendshipId - find( userId: ' + id + ', friendId: ' + friendId +')');
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

  this.updateFriendshipProperty = function(userId, friendId, property, value, successCB, failCB){
    User.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { property: value } },
                          _defaultQueryFunction(successCB, failCB));
  };

  this.updateFriendshipPropertyById = function(id, property, value, successCB, failCB){
    User.findOneAndUpdate({ '_id': id },
                          { $set: { property: value } },
                          _defaultQueryFunction(successCB, failCB));
  };

   this.updateFriendshipStatus = function(id, status, successCB, failCB){
    this.updateFriendshipPropertyById(id, "status", status, successCB, failCB);
  };


  /****   UPDATE PROPERTIES    ***/

  this.updateFriendshipBlockRequesterStatus = function(userId, friendId, block, successCB, failCB){
    this.updateFriendshipProperty(userId, friendId, "blockUserRequester", block, successCB, failCB);
  };

  this.updateFriendshipBlockRequestedStatus = function(userId, friendId, block, successCB, failCB){
    this.updateFriendshipProperty(userId, friendId, "blockUserRequested", block, successCB, failCB);
  };

  this.updateFriendshipVipRequesterStatus = function(userId, friendId, vip,successCB, failCB){
    this.updateFriendshipProperty(userId, friendId, "vipUserRequester", vip, successCB, failCB);
  };

  this.updateFriendshipVipRequestedStatus = function(userId, friendId, vip,successCB, failCB){
    this.updateFriendshipProperty(userId, friendId, "vipUserRequested", vip, successCB, failCB);
  };

  this.updateFriendshipBlockRequesterStatusById = function(id, block, successCB, failCB){
    this.updateFriendshipPropertyById(id, "blockUserRequester", block, successCB, failCB);
  };

  this.updateFriendshipBlockRequestedStatusById = function(userId, friendId, block, successCB, failCB){
    this.updateFriendshipPropertyById(id, "blockUserRequested", block, successCB, failCB);
  };

  this.updateFriendshipVipRequesterStatusById = function(userId, friendId, vip,successCB, failCB){
    this.updateFriendshipPropertyById(id, "vipUserRequester", vip, successCB, failCB);
  };

  this.updateFriendshipVipRequestedStatusById = function(userId, friendId, vip,successCB, failCB){
    this.updateFriendshipPropertyById(id, "vipUserRequested", vip, successCB, failCB);
  };

  /****                     ***/

  this.acceptFriendship = function(id, successCB, failCB){
    this.updateFriendshipStatus(id, 1, successCB, failCB);
  };

  this.rejectFriendship = function(id, successCB, failCB){
    this.updateFriendshipStatus(id, 2, successCB, failCB);
  };

  this.deleteFriendship = function(id, successCB, failCB) {
    console.log('MongoDB - Friendship deleted - findOneAndRemove(' + id + ')');
    Friendship.findOneAndRemove(id, _defaultQueryFunction(successCB, failCB));
  };
};

module.exports = new FriendshipDAO();
