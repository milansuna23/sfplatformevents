var express = require('express');
var jsforce = require('jsforce');
var path = require('path');
var app = express();
app.set('view engine', 'ejs').get('/', renderHome);
var server = require('http').Server(app);
const PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
server.listen(PORT);
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });
var username = 'test-i9batbfndswe@example.com';
var password = '5$9JQgA5S7J7JteRuM8fFDzSxC0iwMZceIG';
var conn = new jsforce.Connection({loginUrl:'https://test.salesforce.com'});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  conn.streaming.topic("/event/Partner_Lead_Event__e").subscribe(function(message) {
    console.dir(message);
    // emit the record to be displayed on the page
    socket.emit('event-processed', JSON.stringify(message));
    console.log(socket);
  });
});

app.use(function(req, res, next){
  res.io = io;
  next();
});

function renderHome(req, res, next) {
  res.render(path.join(__dirname, 'pages/home'));
}
