var User = require('../schema/user.schema.file');
var Mongo = require('mongodb'),
  ObjectID = Mongo.ObjectID;
var users = [
    {
        _id: new ObjectID("55a46c913a411ca032a82882"),
        name: 'test',
        email: 'admin@mail.com',
        role: 'admin',
        password: 'test',
        provider: 'local',
        salt: 'salty',
        facebook: {},
        twitter: {},
        google: {},
        github: {}
    },
    {
        _id: new ObjectID("55a46cb6ecb6332c2c98218c"),
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

var UserDAO = function(){

  this.getUser = function(id, successCB, failCB) {
    if(users.length > id) {
      for(var x = users.length - 1; x >= 0; x--) {
        if(users[x]._id == id) {
          successCB(users[x]);
          return;
        }
      }
    }
    failCB('There is no user with ID #' + id + ' in the Database.');
  };

  this.listAllUsers = function(successCB, failCB) {
    successCB(users);
  };

  this.searchUsersByName = function(query, successCB, failCB) {
    var regExp = new RegExp(query, 'i');
    var results = [];
    for(var x = users.length - 1; x >= 0; x--) {
      if( regExp.test(users[x].name) ) {
        results.push(users[x]);
      }
    }

    successCB(results);
  };

  this.getUserByEmailAndPassword = function(userData, successCB, failCB) {
    for(var x = users.length - 1; x >= 0; x--) {
      if(users[x].email === userData.username && users[x].password === userData.password){
        successCB(users[x]);
        return;
      }
    }

    failCB('No user was found.');
  };

  this.changePassword = function(userData, successCB, failCB) {
    var user;
    for(var x = users.length - 1; x >= 0; x--) {
      if(users[x]._id == userData._id) {
        user = users[x];
      }
    }

    if(user && user.password === userData.oldPassword) {
      user.password = userData.newPassword;
      successCB(user);
    } else {
      failCB('Something went wrong! No Password change.');
    }
  };

  this.createUser = function(userData, successCB, failCB){
    if(userData.email && userData.name && userData.password) {
      var newUser = new User(userData.name, userData.email, userData.password);
      newUser._id = users.length;
      users.push(newUser);

      successCB(newUser);
    } else {
        failCB('Wrong data');
    }
  };

  this.deleteUser = function(userId, successCB, failCB) {
    var user = {};
    for(var x = users.length - 1; x >= 0; x--) {
      if(users[x]._id == userId) {
        user = users.splice(x, 1)[0]
      }
    }

    successCB(user);
  };
};

module.exports = new UserDAO();
