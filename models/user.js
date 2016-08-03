var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create user schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  phone: Number,
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// make this available to our users in our Node applications
module.exports = User;