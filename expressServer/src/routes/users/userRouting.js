var auth = require('../../auth/authorization');
var userController = require('./userController');
var express = require('express');
var router = express.Router();

router.route('/')
  .get(auth.isAuthenticated, userController.listUsers)
  .post(userController.createUser);

router.route('/me')
  .get(auth.isAuthenticated, userController.getLoggedUser)
  .put(auth.isAuthenticated, userController.updateLoggedUser);

router.route('/available')
  .get(auth.isAuthenticated, userController.getAvailableFriends);

router.route('/:userId')
  .get(auth.isAuthenticated, userController.getUser)
  .delete(auth.hasRole('admin'), userController.deleteUser);

router.route('/password/:userId')
  .put(auth.isAuthenticated, userController.changePassword);

module.exports = router;
