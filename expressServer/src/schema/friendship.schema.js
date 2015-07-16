'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
  _id: {  
    userRequested: {type: Schema.ObjectId, ref: 'User'},
    userRequester: {type: Schema.ObjectId, ref: 'User'}
  },
  status: { type: Number, default: 0},
  blockUserRequested: { type: Boolean, default: false},
  blockUserRequester: { type: Boolean, default: false},
  vipUserRequested: { type: Boolean, default: false},
  vipUserRequester: { type: Boolean, default: false}
});

module.exports = mongoose.model('Friendship', FriendshipSchema);