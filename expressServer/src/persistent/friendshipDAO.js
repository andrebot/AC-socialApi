'use strict';
var _ = require('lodash'),
    Friendship = require('./../schema/friendship.schema'),
    Mongo = require('mongodb'),
    ObjectID = Mongo.ObjectID;

var FriendshipDAO = function(){

  // Method to parse the response moving the _id.userRequested 
  // and _id.userRequester to the parent level.
  var _parseQueryFunction = function(successCB, failCB) {
    var parse = function(data) {
      var items = [];
      _.each(data, function(item) {
        var json = item.toJSON();
        json.userRequested = json._id.userRequested;
        json.userRequester = json._id.userRequester;
        delete json._id;
        items.push(json);
      });

      successCB(items);
    };

    return _defaultQueryFunction(parse, failCB);
  };

  var _parseMyFriendsQueryFunction = function(userId, successCB, failCB) {
    var parse = function(data) {
      var items = [];
      _.each(data, function(item) {
        var json = item.toJSON(),
            friend = json._id.userRequested._id == userId ? json._id.userRequester : json._id.userRequested;

        json.user = friend;
        delete json._id;
        items.push(json);
      });

      successCB(items);
    };

    return _defaultQueryFunction(parse, failCB);
  };

  var _defaultQueryFunction = function(successCB, failCB){
    var defaultFunction = function(error, data){
      if(error) return failCB(error);

      if(!data) return failCB('NOT FOUND');

      successCB(data);
    };

    return defaultFunction;
  };

  var _getAllMyFriendshipIdsQueryFunction = function(userId, successCB, failCB) {
    var friendshipSuccessCB = function(data) {
      console.log('Processing ' + data.length + ' friendship ids');

      var ids = _.map(data, function(friendship) {
        return friendship._id.userRequester != userId ? friendship._id.userRequester : friendship._id.userRequested;
      });

      successCB(ids);
    }

    return _defaultQueryFunction(friendshipSuccessCB, failCB);
  }

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
    Friendship.find({}, _defaultQueryFunction(successCB, failCB));
  };

  this.listAllMyFriendships = function(userId, successCB, failCB) {
    console.log('MongoDB - List All My Friendships - find()');
    Friendship
      .find(_defaultQueryMyFriendship(userId))
      .select('_id')
      .populate('_id.userRequested', 'name email')
      .populate('_id.userRequester', 'name email')
      .exec(_parseMyFriendsQueryFunction(userId, successCB, failCB));
  };

  this.getAllMyFriendshipIds = function(userId, successCB, failCB) {
    console.log('MongoDB - List All My Friendship ids - find()');
    
    var query = {
      '$or': [{
          '_id.userRequested': userId
        }, {
          '_id.userRequester': userId
        }
      ]
    };

    Friendship.find(query, '_id', _getAllMyFriendshipIdsQueryFunction(userId, successCB, failCB));
  };

  this.getFriendshipRequested = function(userId, successCB, failCB) {
    console.log('MongoDB - List All Friendships requested by a given user id - find()');

    var handler = _parseQueryFunction(successCB, failCB),
        query = {
          '_id.userRequester': userId,
          'status': 0,
          'blockUserRequested': false,
          'blockUserRequester': false
        };

    Friendship
      .find(query)
      .select('_id')
      .populate('_id.userRequested', 'name email')
      .populate('_id.userRequester', 'name email')
      .exec(handler);
  };

  this.getFriendshipRequests = function(userId, successCB, failCB) {
    console.log('MongoDB - List All Friendships requested to a given user id - find()');

    var handler = _parseQueryFunction(successCB, failCB),
        query = {
          '_id.userRequested': userId,
          'status': 0,
          'blockUserRequested': false,
          'blockUserRequester': false
        };

    Friendship
      .find(query)
      .select('_id')
      .populate('_id.userRequested', 'name email')
      .populate('_id.userRequester', 'name email')
      .exec(handler);
  };

  /****   UPDATE PROPERTIES    ***/

  this.updateFriendshipStatus = function(userId, friendId, status, successCB, failCB){
    console.log('Mongoose - Schema - Friendship updated - userId: ' + userId + ' - FriendId: ' + friendId + ' - status: ' + status );
    
    Friendship.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { "status": status } },
                          { new: true},
                          _defaultQueryFunction(successCB, failCB));
  };

  this.updateFriendshipBlockStatus = function(userId, friendId, block, successCB, failCB){

    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(error, friendship){
      if(error) failCB(error);

      if(!friendship) failCB("Friendship data inconsistency - NOT FOUND - Set BLOCK");

      if (friendship.CheckIsRequester(userId)) { // requester blocking requested
        //this.updateFriendshipProperty(userId, friendId, "blockUserRequested", block, successCB, failCB);
        Friendship.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { "blockUserRequested": block } },
                          { new: true },
                          _defaultQueryFunction(successCB, failCB));

      }else if (friendship.CheckIsRequested(userId)){ // requested blocking requester
        //this.updateFriendshipProperty(userId, friendId, "blockUserRequester", block, successCB, failCB);
        Friendship.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { "blockUserRequester": block } },
                          { new: true },
                          _defaultQueryFunction(successCB, failCB));
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
        //this.updateFriendshipProperty(userId, friendId, "vipUserRequester", vip, successCB, failCB);
        Friendship.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { "vipUserRequester": vip } },
                          { new: true },
                          _defaultQueryFunction(successCB, failCB));
      }else if (friendship.CheckIsRequested(userId)){ // requested set vip requester
        //this.updateFriendshipProperty(userId, friendId, "vipUserRequester", vip, successCB, failCB);
        Friendship.findOneAndUpdate(_defaultQueryFriendshipNonOrdered(userId, friendId),
                          { $set: { "vipUserRequester": vip } },
                          { new: true },
                          _defaultQueryFunction(successCB, failCB));
      }else{
        failCB("Friendship data inconsistency - Set VIP");
      }
    });    
  };

  /****         FRIENDSHIP STATUS            ***/


  this.updateFriendship = function(userId, friendId, status, successCB, failCB){
    var self = this;
    Friendship.findOne(_defaultQueryFriendshipNonOrdered(userId, friendId), function(error, friendship){

      if(error) return failCB(error);

      if(!friendship) return failCB('Friendship does not exists');

      if(friendship.CanUpdateStatus(userId, status)){
        self.updateFriendshipStatus(userId, friendId, status, successCB, failCB);      
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
