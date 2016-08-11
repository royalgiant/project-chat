var express = require('express');
var router = express.Router();
var db = require('../db.js');


// Actual variables used are arbitrary at this point
router.get('/', function(req, res, next) {
	var chatrooms = db.getChatRooms()
});

router.post('/insert', function(req, res, next) {
	var chatroom = db.insertChatRoom(room_name, group_chat, users);
});

router.post('/room/:id', function(req, res, next) {
	var chatroom = db.insertChatRoom(req.params.id);
});

module.exports = router;