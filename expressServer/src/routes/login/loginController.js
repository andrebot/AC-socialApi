var auth = require('../../auth/authorization');
var userDAO = require('../../persistent/userDAO');


var LoginController = function () {
  this.logIn = function(request, response){
    var data = request.body;
    if(data && data.username && data.password) {
      console.log('Loging user ' + data.username);
      var promise = userDAO.getUserByEmailAndPassword(data.username, data.password);
	  promise.then(function(user, error){
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
      });
    }
  };
  
 
};

module.exports = new LoginController();
