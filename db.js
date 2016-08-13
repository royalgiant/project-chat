var mongoose = require('mongoose');
var Message = require('./models/message.js')
var Chatroom = require('./models/chatroom.js')

// mongoose
mongoose.connect('mongodb://localhost/project-chat');

module.exports = {
	// Create a message into DB with a chatroom
	insertMessage: function(message, user_name, chatroom_id) {
		var message = new Message({message: message, user_name: user_name, chatroom_id: chatroom_id});
		message.save(function (err, message) {
			if (err) return console.error(err);
			return message;
		});
	},
	// List all the messages for a chatroom
	getMessages: function(chatroom_id) {
		Message.find({chatroom_id: chatroom_id}, function(err, messages) {
			if (err) return console.error(err);
  			return messages;
		});
	},
	// Create a new chatroom
	insertChatRoom: function(room_name, group_chat, users) {
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
			return chatroom;
		});
	},
	// List all chatrooms available
	getChatRooms: function() {
		Chatroom.find(function(err, chatroom) {
		  if (err) return console.error(err);
		  return chatroom;
		});
	},
	// Get a specific chatroom
	getChatRoom: function(chatroom_id) {
		Chatroom.findOne({chatroom_id: chatroom_id}, function(err, chatroom){
			if (err) return handleError(err);
			return chatroom;
		});
	}
};
