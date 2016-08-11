var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http').Server(app);
var io = require('socket.io')(http);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));
app.use('/users', users);

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/project-chat');

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
      db.insertMessage(msgInfo.room_name, msgInfo.username, msgInfo.msg, msgInfo.unix_time, function(err) {
          if (err) {
              console.log('Error while inserting message into db: ' + err);
          }
      });
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


module.exports = app;
