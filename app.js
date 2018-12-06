var express = require('express');
var jsforce = require('jsforce');
var app = express();
var server = require('http').Server(app);
exports.PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
var username = 'test-i9batbfndswe@example.com';
var password = '5$9JQgA5S7J7JteRuM8fFDzSxC0iwMZceIG';
var conn = new jsforce.Connection({loginUrl:'https://test.salesforce.com'});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  conn.streaming.topic("/event/Partner_Lead_Event__e").subscribe(function(message) {
    console.dir(message);
  });
});
