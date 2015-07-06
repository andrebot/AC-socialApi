var loginController = require('./loginController');
var express = require('express');
var router = express.Router();

router.route('/').post(loginController.logIn);

module.exports = router;
