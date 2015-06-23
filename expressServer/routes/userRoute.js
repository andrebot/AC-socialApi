var express = require('express');
var router = express.Router();
var userDAO = require('../persistent/userDAO');

console.log('Initializing user routes.');

router.route('/list')
  .get(function(request, response){
    response.status(200).json(userDAO.listUsers());
  });

module.exports = router;