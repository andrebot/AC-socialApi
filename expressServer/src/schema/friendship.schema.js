'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
  status: Number,
  userRequested: {type: Schema.ObjectId, ref: 'User'},
  userRequester: {type: Schema.ObjectId, ref: 'User'},
  blockUserRequested: Boolean,
  blockUserRequester: Boolean,
  vipUserRequested: Boolean,
  vipUserRequester: Boolean
});

module.exports = mongoose.model('Friendship', FriendshipSchema);