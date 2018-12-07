var express = require('express');
var jsforce = require('jsforce');
var path = require('path');
process.env.CLIENT_ID='3MVG9w8uXui2aB_pAtfoLESLXYEXcOJIMvTFcYLYkVddlAUCbvsvxYANYyNzGj9p63LR4nkj_mmwSbUBnllfS';
process.env.CLIENT_SECRET_ID='5779680760685351853';
process.env.REDIRECT_URI='https://test.salesforce.com/getAccessToken';
var app = express();
var server = require('http').Server(app);
const PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
server.listen(PORT);
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });

  app.get('/', function(req, res) {
    const oauth2 = new jsforce.OAuth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_ID,
      redirectUri: process.env.REDIRECT_URI
    });
    res.redirect(oauth2.getAuthorizationUrl({}));
  });


app.get('/getAccessToken', function(req,res) {
  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET_ID,
    redirectUri: `${req.protocol}://${req.get('host')}/${process.env.REDIRECT_URI}`
  });
  const conn = new jsforce.Connection({ oauth2 : oauth2 });
  conn.authorize(req.query.code, function(err, userInfo) {
    if (err) {
      return console.error(err);
    }
    const conn2 = new jsforce.Connection({
      instanceUrl : conn.instanceUrl,
      accessToken : conn.accessToken
    });
    conn2.identity(function(err, res) {
      if (err) { return console.error(err); }
      console.log("user ID: " + res.user_id);
      console.log("organization ID: " + res.organization_id);
      console.log("username: " + res.username);
      console.log("display name: " + res.display_name);
    });
  });
});
