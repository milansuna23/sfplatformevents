var express = require('express');
var jsforce = require('jsforce');
var path = require('path');
process.env.CLIENT_ID='3MVG9w8uXui2aB_pAtfoLESLXYEXcOJIMvTFcYLYkVddlAUCbvsvxYANYyNzGj9p63LR4nkj_mmwSbUBnllfS';
process.env.CLIENT_SECRET_ID='5779680760685351853';
process.env.REDIRECT_URI='https://sfplatformevents.herokuapp.com/oauth/_callback';
process.env.LOGIN_SERVER='https://test.salesforce.com';
var app = express();
var server = require('http').Server(app);
const PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
server.listen(PORT);
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });
app.set('view engine', 'ejs');
  app.get('/', function(req, res) {
    const oauth2 = new jsforce.OAuth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_ID,
      loginUrl: process.env.LOGIN_SERVER,
      redirectUri: process.env.REDIRECT_URI
    });
    res.redirect(oauth2.getAuthorizationUrl({}));
  });


app.get('/oauth/_callback', function(req,res) {
  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET_ID,
    loginUrl: process.env.LOGIN_SERVER,
    redirectUri: process.env.REDIRECT_URI
  });
  const conn = new jsforce.Connection({ oauth2 : oauth2 });
  conn.authorize(req.query.code, function(err, userInfo) {
    if (err) {
      return console.error(err);
    }
    console.log("User info is: "+ JSON.stringify(userInfo, null, 2)); 
   /* const conn2 = new jsforce.Connection({
      instanceUrl : conn.instanceUrl,
      accessToken : conn.accessToken
    });
    conn2.identity(function(err, res) {
      if (err) { return console.error(err); }
      console.log("display name: " + res.display_name);
    }); */
    
  });
  res.render(path.join(__dirname, 'pages/home'));
});



