var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var validator = require('express-validator');
var csrf = require('csurf');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

mongoose.connect('mongodb://localhost:27017/cycling');

// custom setup
app.enable('case sensitive routing');
app.set('x-powered-by', false);
app.set('strict routing', true);
app.set('trust proxy', true);
app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());
app.use(csrf({ cookie: true }));
let http = require('http').Server(app);
let io = require('socket.io')(http);

// assign csrf token to all template
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);
  // Pass to next layer of middleware
  next();
});

io.on('connection', (socket) => {
  console.log('user ' + socket.client.id + ' connected');
  // userIds.push(socket.client.id);

  socket.on('disconnect', function () {
    console.log('user' + socket.client.id + 'disconnected');
  });

  socket.on('add-message', (message) => {
    io.emit('message', { type: 'new-message', text: message });

  });


  // either toUserID will be null or roomID will be
  socket.on('sendMsg', function (msg, toUserID, roomID) {
    console.log(toUserID)
    if (toUserID)
      socket.to(toUserID).emit('receiveMsg', msg, socket.id); // private msg
    else if (roomID)
      socket.to(roomID).emit('receiveMsgFromRoom', msg, socket.id, roomID); // msg to room
  });
  socket.on('sendMsgTo', function (msgObj) {
    socket.to(msgObj.to).emit('privateMsg', { msg: msgObj.msg, from: socket.id });
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen(4000, '127.0.0.1', () => {
  console.log('Server Running @ 127.0.0.1:4000');
})
module.exports = app;
