var mongoose = require('mongoose');

// mongoose
mongoose.connect('mongodb://localhost/project-chat');

module.exports = {
	// Create a message into DB with a chatroom
	insertMessage: function() {

	},
	// Create a new chatroom
	insertChatRoom: function() {

	},
	// List all the messages for a chatroom
	getMessages: function() {

	},
	// List all chatrooms available
	getChatRooms: function() {

	},
	// Get a specific chatroom
	switchChatRooms: function() {

	}
};
