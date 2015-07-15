var auth = require('../../auth/authorization');
var friendshipController = require('./friendshipController');
var express = require('express');
var router = express.Router();

router.route('/')
  .get(friendshipController.listAllFriendships);


router.route('/:friendshipId')
  .get(friendshipController.getFriendship);

module.exports = router;
