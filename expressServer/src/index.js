//importing express
var express = require('express');
//creating server
var app = express();
//Middleware for parsing body content
var bodyParser = require('body-parser');
//Middleware for parsing cookies
var cookieParser = require('cookie-parser');
//Instantiating routes
var users = require('./routes/usersRoute');
var login = require('./routes/loginRoute');

console.log('Making public folder public...');
app.use(express.static('../public'));

console.log('Adding Middlewares...');
//Adding body-parser as first middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Adding cookie-parser as third middleware
app.use(cookieParser());

//Preparing routes
app.use('/users', users);
app.use('/login', login);

console.log('Initializing server...');
var server = app.listen(3000, function(){
  var address = server.address();

  console.log('Listening at http://%s:%s...', address.address, address.port);
});