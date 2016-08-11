var express = require('express');
var router = express.Router();
var db = require('../db.js');


// Actual variables used are arbitrary at this point
// PROBLEM: We should probably limit the amount of messages we get because if we had 1 billion, that'd be alot of messages
router.get('/', function(req, res, next){
    if (req.query.chatroom) {
        db.getMessages(req.query.chatroom, function(err, rows) {
            if (err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        });
    } else {
        res.send('Invalid URL: no chat room or limit specified! Example of good URL: /messages?chatroom=general&limit=10&timezoneoffsethours=5');
    }
});

module.exports = router;