var friendshipDAO = require('../../persistent/friendshipDAO');


var FriendshipController = function () { 

  this.listAllFriendships = function(request, response) {
    
    var fail = function(error, data) {
      console.log('Friendship Controller Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };

    console.log('Getting all friendships.');
    friendshipDAO.listAllFriendships(success, fail);
    
  };
  
  this.listMyFriendships = function(request, response) {
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - List My Friendships - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };

    console.log('Getting my friendships.');
    friendshipDAO.listAllMyFriendships(token._id, success, fail);
    
  };

  this.getFriendship = function(request, response) {  	
	  var token = request.token;
    var friendId = request.params.friendId;
    var fail = function(error) {
      if(error) {
        console.log('Friendship Controller Error: ' + error);
        console.log('Returning empty result');
        response.status(200).json({});
      }
    };
    var success = function(data) {
      if(data) {
        console.log('Returning result: ' + data);
        response.status(200).json(data);
      }
    };
    console.log('Getting Friendship with Friends_Id #' + friendId);
    friendshipDAO.getFriendship(token._id, friendId, success, fail);
  };
  
  
  this.inviteFriend = function(request, response) {
	  var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - Invite Friend - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('Inviting one friend');
    friendshipDAO.createFriendship(token._id, friendId, success, fail);
  };

  this.acceptFriend = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - acceptFriend - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('Accepting a friend');
    friendshipDAO.acceptFriendship(token._id, friendId, success, fail);
  };

  this.rejectFriend = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - rejectFriend - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('Rejecting a friend');
    friendshipDAO.rejectFriendship(token._id, friendId, success, fail);
  };

  this.setVip = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - setVip - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('set friend as vip');
    friendshipDAO.updateFriendshipVipStatus(token._id, friendId, true, success, fail);
  };


  this.unsetVip = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - unsetVip - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('unset friend as vip');
    friendshipDAO.updateFriendshipVipStatus(token._id, friendId, false, success, fail);
  };


  this.setBlock = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - setBlock - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('block friend');
    friendshipDAO.updateFriendshipBlockStatus(token._id, friendId, true, success, fail);
  };


  this.unsetBlock = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var fail = function(error, data) {
      console.log('Friendship Controller - unsetBlock - Error: ' + error);
      response.status(403).send({error: error, data: data});
    };
    var success = function(data) {
      response.status(200).json(data);
    };  
    console.log('unblock friend');
    friendshipDAO.updateFriendshipBlockStatus(token._id, friendId, false, success, fail);
  };




};

module.exports = new FriendshipController();
