var should = require("should");
var mongoose = require('mongoose');
var User = require("../models/user.js");
var db;

describe( 'User', function() {

	before(function(done) {
		db = mongoose.connect('mongodb://localhost/project-chat');
		done();
	});

	after(function(done) {
		mongoose.connection.close();
		done();
	});

	beforeEach(function(done) {
		var user = new User({
			username: 'donny',
			password: 'donny123',
			email: 'donny123@gmail.com'
		});

		user.save(function(error) {
			if (error) console.log('error' + error.message);
			else console.log('no error');
			done();
		});
	});

	it('find a user by username', function(done) {
		User.findOne({ username: 'donny'}, function(err, user) {
			user.username.should.eql('donny');
			console.log(" username: ", user.username);
			done();
		});
	});
	
	afterEach(function(done) {
		User.remove({}, function() {
			done(); 
		});
	});
});