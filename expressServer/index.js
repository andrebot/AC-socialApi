var express = require('express');
var app = express();
var user = require('./routes/userRoute');

app.use('/user', user);

var server = app.listen(3000, function(){
  var address = server.address();

  console.log("Listening at http://%s:%s...", address.address, address.port);
});