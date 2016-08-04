var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create user schema
var messageSchema = new Schema({
  message: String,
  user_name: String,
  chatroom_id: String,
  created_at: Date,
  updated_at: Date 
});

// make this available to our users in our Node applications
module.exports = User;