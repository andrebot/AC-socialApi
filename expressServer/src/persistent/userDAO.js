var users = [
  {
    id: 0,
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
    id: 1,
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

var User = function(name, email, password) {
  this.name = name || '';
  this.email = email || '';
  this.role = 'user';
  this.password = password || '';
  this.provider = 'local';
  this.salt = '';
  this.facebook = {};
  this.twitter = {};
  this.google = {};
  this.github= {};
};

var UserDAO = function(){

  this.getUser = function(id) {
    return (users.length > id) ? users[id] : {};
  };

  this.listAllUsers = function() {
    return users;
  };

  this.searchUsersByName = function(query) {
    var regExp = new RegExp(query, 'i');
    var results = [];
    for(var x = users.length - 1; x >= 0; x--) {
      if( regExp.test(users[x].name) ) {
        results.push(users[x]);
      }
    }

    return results;
  };

  this.getUserByEmailAndPassword = function(email, password) {
    for(var x = users.length - 1; x >= 0; x--) {
      if(users[x].email === email && users[x].password === password){
        return users[x];
      }
    }

    return null;
  };

  this.changePassword = function(userId, oldPassword, newPassword) {
    var user = users[userId];

    if(user && user.password === oldPassword) {
      user.password = newPassword;
    }

    return user;
  };

  this.createUser = function(name, email, password){
    var newUser = new User(name, email, password);
    newUser.id = users.length;
    users.push(newUser);

    return newUser;
  };

  this.deleteUser = function(userId) {
    return  (users.length > userId) ? users.splice(userId, 1)[0] : {};
  };
};

module.exports = new UserDAO();