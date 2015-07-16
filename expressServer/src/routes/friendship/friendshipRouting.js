var auth = require('../../auth/authorization');
var friendshipController = require('./friendshipController');
var express = require('express');
var router = express.Router();

router.route('/')
  .get(friendshipController.listAllFriendships); //Done

router.route('/me')
  .get(friendshipController.listMyFriendships);


router.route('/:friendId')
  .get(friendshipController.getFriendship), //Done
  .post(friendshipController.inviteFriend),
  .put(friendshipController.acceptFriend),
  .delete(friendshipController.rejectFriend);
 
router.route('/:friendId/vip')
  .put(friendshipController.setVip),
  .delete(friendshipController.unsetVip);
 

router.route('/:friendId/block')
  .put(friendshipController.setBlock),
  .delete(friendshipController.unsetBlock);
 

  
  
module.exports = router;
