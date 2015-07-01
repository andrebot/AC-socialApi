var express = require('express');
var router = express.Router();
var auth = require('../auth/authorization');
var userDAO = require('../persistent/userMongoDAO');

router.route('/').post(function(request, response){
  var data = request.body;
  if(data && data.username && data.password) {
    console.log('Loging user ' + data.username);
    var user = userDAO.getUserByEmailAndPassword(data.username, data.password);
    if(user){
      var payload = {_id: user.id, role: user.role};
      var token = auth.signToken(payload);

      console.log('Returning token');
      response.status(200).json(token);
    } else {
      var errorMsg = 'Could not find user ' + data.username;
      console.log(errorMsg);
      response.status(403).send(errorMsg)
    }
  }
});

module.exports = router;