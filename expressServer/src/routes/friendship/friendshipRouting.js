var auth = require('../../auth/authorization');
var friendshipController = require('./friendshipController');
var express = require('express');
var router = express.Router();

router.route('/')
  .get(auth.isAuthenticated, friendshipController.listAllFriendships);

router.route('/me')
  .get(auth.isAuthenticated, friendshipController.listMyFriendships);

router.route('/requests')
  .get(auth.isAuthenticated, friendshipController.listFriendshipsRequests);

router.route('/requested')
  .get(auth.isAuthenticated, friendshipController.listFriendshipsRequested);

router.route('/:friendId')
  .get(auth.isAuthenticated, friendshipController.getFriendship)
  .post(auth.isAuthenticated, friendshipController.inviteFriend)
  .put(auth.isAuthenticated, friendshipController.acceptFriend)
  .delete(auth.isAuthenticated, friendshipController.rejectFriend);

router.route('/vip/:friendId')
  .post(auth.isAuthenticated, friendshipController.setVip)
  .delete(auth.isAuthenticated, friendshipController.unsetVip);

router.route('/block/:friendId')
  .post(auth.isAuthenticated, friendshipController.setBlock)
  .delete(auth.isAuthenticated, friendshipController.unsetBlock);

module.exports = router;
