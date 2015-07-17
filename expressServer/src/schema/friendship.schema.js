'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
  _id: {  
    userRequested: {type: Schema.ObjectId, ref: 'User'},
    userRequester: {type: Schema.ObjectId, ref: 'User'}
  },
  status: { type: Number, default: 0, min: 0, max: 2},
  blockUserRequested: { type: Boolean, default: false},
  blockUserRequester: { type: Boolean, default: false},
  vipUserRequested: { type: Boolean, default: false},
  vipUserRequester: { type: Boolean, default: false}
});

FriendshipSchema.methods.CheckIsRequester  = function(userId) {
  return this._id.userRequester.toString() === userId;
};


FriendshipSchema.methods.CheckIsRequested  = function(userId) {
  return this._id.userRequested.toString() === userId;
};


FriendshipSchema.methods.CanUpdateStatus  = function(userId, status) {    
  console.log('checking if can update status: ' + userId + ' - status: ' + status);
  return this._id.userRequested.toString() === userId || status === 0;
};




FriendshipSchema
  .path('status')
  .validate(function(value, respond) {
      var errMessage = 'Friendship Validation - Requested Blocked';
      console.log(errMessage);          
      return respond(!this.blockUserRequested);
  }, 'Requested User is Blocked')
  .validate(function(value, respond) {
    var errMessage = 'Friendship Validation - Requester Blocked';
    console.log(errMessage);          
    return respond(!this.blockUserRequester);
  }, 'Requester User is Blocked');

    

//FriendshipSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Friendship', FriendshipSchema);