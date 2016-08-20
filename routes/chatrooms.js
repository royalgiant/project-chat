var express = require('express');
var router = express.Router();
var Chatroom = require('../models/chatroom.js')


// Actual variables used are arbitrary at this point

// List all chatrooms available
router.get('/', function(req, res, next) {
	Chatroom.find({}, function(err, chatroom) {
	  	if (err) return console.error(err);
	  	if (chatroom.length == 0) {
	  		return res.send("There are no chatrooms");
	  	} else {
	  		return res.send(chatroom);
	  	}  	
	});
});

// Create a new chatroom
router.post('/insert', function(req, res, next) {
	room_name = req.body["room_name"];
	group_chat = req.body["group_chat"];
	user_name = req.body["users_names"];
	user_id = req.body["user_ids"];

	var chatroom = new Chatroom({room_name: room_name, 
		group_chat: group_chat, 
		users_names: [ String(user_name) ],
		user_ids: [ String(user_id) ]
	});

	chatroom.save(function (err, chatroom) {
		if (err) return console.error(err);
		return res.send(chatroom);
	});
});

// Get a specific chatroom
router.get('/room/:id', function(req, res, next) {
	var chatroom_id = req.params.id;
	Chatroom.findOne({_id: chatroom_id}, function(err, chatroom){
		if (err) return handleError(err);
		res.render('chat', {
			user: req.user,
			chatroom: chatroom
		});
	});
});

module.exports = router;