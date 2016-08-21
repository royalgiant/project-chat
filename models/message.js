var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create user schema
var Message = new Schema({
  message: String,
  user_name: String,
  chatroom_id: String,
  created_at: String
});

// make this available to our users in our Node applications
module.exports = mongoose.model('Message', Message);