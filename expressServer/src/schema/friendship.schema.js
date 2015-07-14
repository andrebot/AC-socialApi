'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
  status: { type: Number, default: 0},
  userRequested: {type: Schema.ObjectId, ref: 'User'},
  userRequester: {type: Schema.ObjectId, ref: 'User'},
  blockUserRequested: { type: Boolean, default: false},
  blockUserRequester: { type: Boolean, default: false},
  vipUserRequested: { type: Boolean, default: false},
  vipUserRequester: { type: Boolean, default: false}
});

module.exports = mongoose.model('Friendship', FriendshipSchema);