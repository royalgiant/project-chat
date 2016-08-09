var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create user schema
var User = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
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

User.plugin(passportLocalMongoose);

// make this available to our users in our Node applications
module.exports = mongoose.model('User', User);