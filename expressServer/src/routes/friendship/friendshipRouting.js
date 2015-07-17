var auth = require('../../auth/authorization');
var friendshipController = require('./friendshipController');
var express = require('express');
var router = express.Router();

router.route('/')
  .get(auth.isAuthenticated, friendshipController.listAllFriendships);  // OK

router.route('/me')
  .get(auth.isAuthenticated, friendshipController.listMyFriendships);  // OK


router.route('/:friendId')
  .get(auth.isAuthenticated, friendshipController.getFriendship) // OK
  .post(auth.isAuthenticated, friendshipController.inviteFriend) // OK
  .put(auth.isAuthenticated, friendshipController.acceptFriend)  // OK
  .delete(auth.isAuthenticated, friendshipController.rejectFriend); // OK
 
router.route('/:friendId/vip')
  .post(auth.isAuthenticated, friendshipController.setVip)
  .delete(auth.isAuthenticated, friendshipController.unsetVip);
 

router.route('/:friendId/block')
  .post(auth.isAuthenticated, friendshipController.setBlock)
  .delete(auth.isAuthenticated, friendshipController.unsetBlock);
 

  
  
module.exports = router;
