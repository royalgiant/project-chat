var express = require('express');
var router = express.Router();
var db = require('../db.js');
var Chatroom = require('../models/chatroom.js')


// Actual variables used are arbitrary at this point
// List all chatrooms available
router.get('/', function(req, res, next) {
	console.log('got into routes')
	Chatroom.find({}, function(err, chatroom) {
	  	if (err) return console.error(err);
	  	if (chatroom.length == 0) {
	  		return "There are no chatrooms";
	  	} else {
	  		console.log(chatroom)
	  		return res.send(chatroom);
	  	}  	
	});
});

router.post('/insert', function(req, res, next) {
	var chatroom = db.insertChatRoom(room_name, group_chat, users);
});

router.post('/room/:id', function(req, res, next) {
	var chatroom = db.insertChatRoom(req.params.id);
});

module.exports = router;