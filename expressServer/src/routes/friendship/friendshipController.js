var friendshipDAO = require('../../persistent/friendshipDAO');


var FriendshipController = function () { 

  var success = function(response) {
    return function(data) {
      if (data) {
        response.json(data);
      } else {
        response.sendStatus(200);
      }
    };
  };

  var fail = function(errorMessage, response) {
    return function(error, data) {
      console.log('Friendship Controller - ' + errorMessage + error);
      response.status(403).send({error: error, data: data});
    };
  };

  var failWithEmptyResponse = function(errorMsg, response) {
    return function(error) {
      console.log('Friendship Controller - ' + errorMsg + error);
      console.log('Returning empty results');
      response.status(200).json({});
    };
  };

  this.listAllFriendships = function(request, response) {
    var errorMsg = 'List All Friendships - Error: ';

    console.log('Getting all friendships.');

    friendshipDAO.listAllFriendships(success(response), fail(errorMsg, response));
  };
  
  this.listMyFriendships = function(request, response) {
    var token = request.token;
    var errorMsg = 'List My Friendships - Error: ';

    console.log('Getting my friendships.');

    friendshipDAO.listAllMyFriendships(token._id, success(response), fail(errorMsg, response));
  };

  this.listFriendshipsRequested = function(request, response) {
    var token = request.token;
    var errorMsg = 'List Friendships Requested: ';

    console.log('Getting Friendships that logged user requested.');

    friendshipDAO.getFriendshipRequested(token._id, success(response), failWithEmptyResponse(errorMsg, response));
  };

  this.listFriendshipsRequests = function(request, response) {
    var token = request.token;
    var errorMsg = 'List Friendships Requests: ';

    console.log('Getting Friendships that logged user received.');

    friendshipDAO.getFriendshipRequests(token._id, success(response), failWithEmptyResponse(errorMsg, response));
  };

  this.getFriendship = function(request, response) {  	
	  var token = request.token;
    var friendId = request.params.friendId;
    var errorMsg = 'Get Friendship: ';

    console.log('Getting Friendship with Friends_Id #' + friendId);

    friendshipDAO.getFriendship(token._id, friendId, success(response), failWithEmptyResponse(errorMsg, response));
  };
  
  
  this.inviteFriend = function(request, response) {
	  var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Invite Friend :';

    console.log('Inviting one friend');

    friendshipDAO.createFriendship(token._id, friendId, success(response), fail(errorMsg, response));
  };

  this.acceptFriend = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Accept Friend: ';

    console.log('Accepting a friend');

    friendshipDAO.acceptFriendship(token._id, friendId, success(response), fail(errorMsg, response));
  };

  this.rejectFriend = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Reject Friend: ';

    console.log('Rejecting a friend');

    friendshipDAO.rejectFriendship(token._id, friendId, success(response), fail(errorMsg, response));
  };

  this.setVip = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Set VIP: ';

    console.log('set friend as vip');

    friendshipDAO.updateFriendshipVipStatus(token._id, friendId, true, success(response), fail(errorMsg, response));
  };


  this.unsetVip = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Unset VIP: ';

    console.log('unset friend as vip');

    friendshipDAO.updateFriendshipVipStatus(token._id, friendId, false, success(response), fail(errorMsg, response));
  };


  this.setBlock = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Set Block: ';

    console.log('block friend');

    friendshipDAO.updateFriendshipBlockStatus(token._id, friendId, true, success(response), fail(errorMsg, response));
  };


  this.unsetBlock = function(request, response) {
    var friendId = request.params.friendId;
    var token = request.token;
    var errorMsg = 'Unset Block: ';

    console.log('unblock friend');

    friendshipDAO.updateFriendshipBlockStatus(token._id, friendId, false, success(response), fail(errorMsg, response));
  };
};

module.exports = new FriendshipController();
