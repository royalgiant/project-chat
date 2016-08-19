var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// create user schema
var User = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
  },
  phone: Number,
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
}, {timestamps: true});

User.plugin(passportLocalMongoose);

// make this available to our users in our Node applications
module.exports = mongoose.model('User', User);