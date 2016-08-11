var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create user schema
var Chatroom = new Schema({
  room_name: String,
  group_chat: Boolean,
  users_names: Array,
  user_ids: Array,
  created_at: Date,
  updated_at: Date
});

// make this available to our users in our Node applications
module.exports = mongoose.model('Chatroom', Chatroom);