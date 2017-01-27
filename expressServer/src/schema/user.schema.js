'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
  provider: String,
  salt: String,
 });


/**
 * Validations
 */

//Validate empty name
UserSchema
    .path('name')
    .validate(function(name){
      if(name) {
        return true;
      }
      return false;
    }, 'Name cannot be blank');

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length > 0;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password))
      next(new Error('Invalid password'));
    else
      next();
  });

module.exports = mongoose.model('User', UserSchema);
