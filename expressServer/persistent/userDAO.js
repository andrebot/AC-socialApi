var users = [
  {
    name: 'Andre Botelho Almeida',
    email: 'andrebot_almeida@hotmail.com',
    role: 'admin',
    password: 'theasdf123',
    provider: 'avenuecode',
    salt: 'salty',
    facebook: {},
    twitter: {},
    google: {},
    github: {}
  },
  {
    name: 'Bruno Araujo',
    email: 'brunoaraujo1942@uol.com',
    role: 'user',
    password: 'pipoca',
    provider: 'avenuecode',
    salt: 'salty',
    facebook: {},
    twitter: {},
    google: {},
    github: {}
  }
];

var userTemplate = {
  name: '',
  email: '',
  role: '',
  password: '',
  provider: '',
  salt: '',
  facebook: {},
  twitter: {},
  google: {},
  github: {}
};

var UserDAO = function(){

  this.getUser = function(id) {

  };

  this.listUsers = function() {
    return users;
  };

  this.addFriend = function(user, friendId) {

  };

  this.removeFriend = function(user, friendId) {

  };

  this.blockFriend = function(user, friendId) {

  };

  this.createUser = function(){

  };
};

module.exports = new UserDAO();