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

  this.getFriendship = function(request, response) {  	
    var friendshipId = request.params.friendshipId;
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
    console.log('Getting Friendship #' + friendshipId);
    friendshipDAO.getFriendship(friendshipId, success, fail);
  };


};

module.exports = new FriendshipController();
