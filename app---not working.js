var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

      io.on('connection', (socket) => {
      console.log('user '+ socket.client.id +' connected');
 // userIds.push(socket.client.id);
  
      socket.on('disconnect', function () {
          console.log('user' + socket.client.id + 'disconnected');
        });

      socket.on('add-message', (message) => {
        io.emit('message', { type: 'new-message', text: message});    
  
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

app.use('/', index);
app.use('/users', users);

//===================================================================================================================
//   app.set('users', {});
// app.set('userObjects', {});

// io.on('connect', function (socket) {
//     console.log('User connected');
//     socket.auth = false;
//     socket.on('authenticate', function(data){
//         //check the auth data sent by the client
//         console.log(data);
//         currentUser(data).then(function(success){
//             if (success){
//                 console.log("Authenticated socket ", socket.id);
//                 socket.auth = true;
//                 app.get('users')[success._id] = socket.id;
//                 app.get('userObjects')[socket.id]=success;
//             }
//         }).catch(function (e) {
//             console.log(e);
//         });
//     });
//     setTimeout(function(){
//         //If the socket didn't authenticate, disconnect it
//         if (!socket.auth) {
//             console.log("Disconnecting socket ", socket.id);
//             socket.disconnect('unauthorized');
//             app.get('users')[socket.id] = null;
//             app.get('userObjects')[socket.id] = null;
//         }
//     }, 2000);

//     socket.on('disconnect', function() {
//         console.log('User disconnected');
//     });

//     socket.on('save-message', function (data) {
//         console.log(data);
//         data.fromId=app.get('userObjects')[socket.id]._id;
//         io.to(app.get('users')[data.toId]).emit('new-message', { message: data });
//     });

//     socket.on('howareyou', function (data) {
//         console.log('typing...');
//         console.log(data);
//         data.hash= app.get('userObjects')[socket.id]._id + '#' + data.toId;
//         io.to(app.get('users')[data.toId]).emit('amgood', { message: data });
//     });
// });

// app.post('/chat', function(req, res, next) {
//   //currentUser(req).then(function (user) {
//       let from = req.body.member._id;
//       let to = req.body.recipient_id;

//       console.log(req.body);
//       console.log(app.get('users'));

//       io.to('message').emit('save-message', req.body.message);

//       cyclists.findOneAndUpdate({'member.member_id': req.body.member_id, 'member.messages.recepient.member_id': to},
//       {'member.messages.recipient.message': req.body.message},function (err, post) {
//           if (err) return next(err);
//           res.json(post);
//       });
//  // })
// });

// app.get('/chat/users', function(req, res, next) {
//   console.log(1);
//   console.log(req.body);
//    MongoClient.connect('mongodb://rider:rider2017@ds145208.mlab.com:45208/ridersdb', function(err, db){
//         if (err) return console.log(err);
//         db.collection('users').find({}).toArray(function(err, users){
//             console.log(users);
//             res.json(users);
//         });
//     });
// });

// app.get('/chat/messages/:id', function(req, res, next) {
//   console.log(req.params.id +' => getMessages of userId ');
//   currentUser(req).then(function (user) {
//       var q = Message.find({fromId:user._id, toId:req.params.id}).sort({createdDate:1}).limit(20);
//       q.exec(function(err, msgs){
//           res.send(msgs);
//       });
//   })


// });
//===================================================================================================================
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
