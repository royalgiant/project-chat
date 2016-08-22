var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var request = require('request');
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routes 
var routes = require('./routes/index.js');
var users = require('./routes/users.js');
var chatRoomsRouter = require('./routes/chatrooms.js');
var messagesRouter = require('./routes/messages.js');

// Models Required
var Message = require('./models/message.js')

// mongoose
if(app.get('env') === 'development') {
  mongoose.connect('mongodb://localhost/project-chat');
} else {
  /* 
  * Mongoose by default sets the auto_reconnect option to true.
  * We recommend setting socket options at both the server and replica set level.
  * We recommend a 30 second connection timeout because it allows for 
  * plenty of time in most operating environments.
  */
  var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

  var mongodbUri = process.env.MONGODB_URI;

  mongoose.connect(mongodbUri, options);
  var conn = mongoose.connection;
  conn.on('error', console.error.bind(console, 'connection error:'));  
}

var PORT = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(require('express-session')({ 
  secret: 'safety first',
  resave: false,
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


app.use('/', require('./routes/index.js'));
app.use('/users', users);
app.use('/chatrooms', chatRoomsRouter);
app.use('/messages', messagesRouter);

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var connectedUsers = {};

io.on('connection', function(socket) {
  socket.on('chat message', function(msgInfo) {
      // Send that message to everyone.
      io.emit('chat message', msgInfo);
      
      // Insert that message to database
      if (msgInfo.chatroom_id) {
          var message = new Message({ message: msgInfo.message, user_name: msgInfo.user_name, chatroom_id: msgInfo.chatroom_id, created_at: msgInfo.created_at });
          message.save(function (err, message) {
              if (err) return console.error(err);
              return message;
          });
      } else {
          res.send('Invalid URL: no chat room specified! Example of good URL: /messages?chatroom=general');
      }
  });

  /* Talk about this later
  socket.on('switchRoom', function(newroom){
      // leave the current room (stored in session)
      socket.leave(socket.room);
      // join new room, received as function parameter
      socket.join(newroom);
      // update socket session room title
      socket.room = newroom;
      io.emit('switchedRoom', newroom);
  });
  */ 
  socket.on('disconnect', function() {
    io.emit('user disconnected')
  });

});

http.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});


module.exports = {app: app, server: http};;