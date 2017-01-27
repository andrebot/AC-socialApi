var auth = require('../../auth/authorization');
var userDAO = require('../../persistent/userDAO');


var LoginController = function () {
  this.logIn = function(request, response){
    var data = request.body;
	var fail = function(){
		var errorMsg = 'Could not find user ' + data.username;
		console.log(errorMsg);
		response.status(403).send(errorMsg)
	};
	var success = function(user){
      var payload = {_id: user._id, role: user.role};
      var token = auth.signToken(payload);
      console.log('Returning token');
      response.status(200).json(token);
	};
    if(data && data.username && data.password) {
      console.log('Loging user ' + data.username);
      userDAO.getUserByEmailAndPassword(data, success, fail);
    }else{
    	var errorMsg = 'required data not filled';
    	console.log(errorMsg);
    	console.log(data);
    	response.status(403).send(errorMsg)
    }
  };
};

module.exports = new LoginController();
