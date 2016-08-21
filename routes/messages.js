var express = require('express');
var router = express.Router();
var Message = require('../models/message.js')

// Actual variables used are arbitrary at this point
// PROBLEM: We should probably limit the amount of messages we get because if we had 1 billion, that'd be alot of messages
router.get('/:chatroom_id', function(req, res, next){
    var chatroom_id = req.params.chatroom_id
    if (chatroom_id) {
        Message.find({chatroom_id: chatroom_id}, function(err, messages) {
            if (err) return console.error(err);
            return res.send(messages);
        });
    } else {
        res.send('Invalid URL: no chat room or limit specified! Example of good URL: /messages?chatroom=general&limit=10&timezoneoffsethours=5');
    }
});

router.post('/insert', function(req, res, next) {
    var message = function(message, user_name, chatroom_id) {
        if (req.query.chatroom) {
            var message = new Message({message: message, user_name: user_name, chatroom_id: chatroom_id});
            message.save(function (err, message) {
                if (err) return console.error(err);
                return message;
            });
        } else {
            res.send('Invalid URL: no chat room specified! Example of good URL: /messages?chatroom=general');
        }
    };
}); 

module.exports = router;