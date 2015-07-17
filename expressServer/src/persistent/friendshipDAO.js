'use strict';
var Friendship = require('./../schema/friendship.schema'),
  Mongo = require('mongodb'),
  ObjectID = Mongo.ObjectID;

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
     '_id.userRequested': friendId, 
     '_id.userRequester': userId     
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
        { 
          '_id.userRequested': userId          
        },
        {
          '_id.userRequester': userId 
        } 
      ],
	  'status' : 1, // Status = accepted(1)
	  'blockUserRequested' : false,
	  'blockUserRequester' : false
    };
  };

  /*****       GET/LIST FRIENDSHIPS   ***/

  this.getFriendship = function(userId, friendId, successCB, failCB) {
    console.log('MongoDB - Get Friendship By User Id and FriendId - find( userId: ' + userId + ', friendId: ' + friendId +')');
    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), _defaultQueryFunction(successCB, failCB));
  };  

  this.listAllFriendships = function(successCB, failCB) {
    console.log('MongoDB - List All Friendships - findById()');
    Friendship.find({}, _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };

  this.listAllMyFriendships = function(userId, successCB, failCB) {
    console.log('MongoDB - List All My Friendships - find()');
    Friendship.find(_defaultQueryMyFriendship(userId), _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };
  

  /****   UPDATE PROPERTIES    ***/

  this.updateFriendshipProperty = function(userId, friendId, property, value, successCB, failCB){
    Friendship.findOneAndUpdate(_defaultQueryFriendshipInOrder(userId, friendId),
                          { $set: { property: value } },
                          { runValidators: true }, 
                          _defaultQueryFunction(successCB, failCB)).populate('userRequested userRequester');
  };

  this.updateFriendshipStatus = function(userId, friendId, status, successCB, failCB){
    console.log('Mongoose - Schema - Friendship updated');
    this.updateFriendshipProperty(userId, friendId, "status", status, successCB, failCB);
  };

  this.updateFriendshipBlockStatus = function(userId, friendId, block, successCB, failCB){

    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(error, friendship){
      if(error) failCB(error);

      if(!friendship) failCB("Friendship data inconsistency - NOT FOUND - Set BLOCK");

      if (friendship.CheckIsRequester(userId)) { // requester blocking requested
        this.updateFriendshipProperty(userId, friendId, "blockUserRequested", block, successCB, failCB);
      }else if (friendship.CheckIsRequested(userId)){ // requested blocking requester
        this.updateFriendshipProperty(userId, friendId, "blockUserRequester", block, successCB, failCB);
      }else{
        failCB("Friendship data inconsistency - Set VIP");
      }    
    });    
  };


  this.updateFriendshipVipStatus = function(userId, friendId, vip,successCB, failCB){
    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(error, friendship){

      if(error) failCB(error);

      if(!friendship) failCB("Friendship data inconsistency - NOT FOUND - Set VIP");

      if (friendship.CheckIsRequester(userId)) { // requester set vip requested
        this.updateFriendshipProperty(userId, friendId, "vipUserRequester", vip, successCB, failCB);
      }else if (friendship.CheckIsRequested(userId)){ // requested set vip requester
        this.updateFriendshipProperty(userId, friendId, "vipUserRequester", vip, successCB, failCB);
      }else{
        failCB("Friendship data inconsistency - Set VIP");
      }
    });    
  };

  /****         FRIENDSHIP STATUS            ***/


  this.updateFriendship = function(userId, friendId, status, successCB, failCB){
    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(error, friendship){

      if(error) return failCB(error);

      if(!friendship) return failCB('Friendship does not exists');

      if(friendship.CanUpdateStatus(userId, status)){
        this.updateFriendshipStatus(userId, friendId, status, successCB, failCB);      
      }else{
        return failCB('You cant approve your own request');        
      }
    });    
  };


  this.acceptFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendship(userId, friendId, 1, successCB, failCB);
  };

  this.rejectFriendship = function(userId, friendId, successCB, failCB){
    this.updateFriendship(userId, friendId, 2, successCB, failCB);
  };


  this.createFriendship = function(userId, friendId, successCB, failCB){
    var self = this;
    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(err, friendship){
      if(err) return failCB(err);

      if(friendship){
        if(!friendship.blockUserRequested && !friendship.blockUserRequester){ //Not blocked        
          self.updateFriendshipStatus(userId, friendId, 0, successCB, failCB);
        }else{
          console.log('Mongoose - Schema - Friendship cannot be updated');
        }
      }else{
        var newFriendship = new Friendship({ 
          '_id' :{ 
            userRequester: new ObjectID(userId),
            userRequested:  new ObjectID(friendId)
          }
        });

        newFriendship.save(function(error){
          if(error) {
            failCB(error)
          } else {
            console.log('Mongoose - Schema - Friendship created');
            successCB(newFriendship);
          }
        });
      }
    });

      
  };
};

module.exports = new FriendshipDAO();
