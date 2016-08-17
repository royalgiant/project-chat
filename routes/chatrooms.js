var express = require('express');
var router = express.Router();
var Chatroom = require('../models/chatroom.js')


// Actual variables used are arbitrary at this point

// List all chatrooms available
router.get('/', function(req, res, next) {
	console.log('got into routes')
	Chatroom.find({}, function(err, chatroom) {
	  	if (err) return console.error(err);
	  	if (chatroom.length == 0) {
	  		return res.send("There are no chatrooms");
	  	} else {
	  		console.log(chatroom)
	  		return res.send(chatroom);
	  	}  	
	});
});

// Create a new chatroom
router.post('/insert', function(req, res, next) {
	var chatroom = function(room_name, group_chat, users) {
		users_names = []
		user_ids = []
		for (var user in users) {
			users_names.push(user.name);
			user_ids.push(user._id);
		}
		var chatroom = new Chatroom({room_name: room_name, 
			group_chat: group_chat, 
			users_names: users_names,
			user_ids: user_ids
		});
		chatroom.save(function (err, chatroom) {
			if (err) return console.error(err);
			return res.send(chatroom);
		});
	}
});

// Get a specific chatroom
router.post('/room/:id', function(req, res, next) {
	Chatroom.findOne({chatroom_id: chatroom_id}, function(err, chatroom){
		if (err) return handleError(err);
		return res.send(chatroom);
	});
});

module.exports = router;