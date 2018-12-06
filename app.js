var jsforce = require('jsforce');
var username = 'test-i9batbfndswe@example.com';
var password = '5$9JQgA5S7J7JteRuM8fFDzSxC0iwMZceIG';
var conn = new jsforce.Connection({});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  conn.streaming.topic("/event/Partner_Lead_Event__e").subscribe(function(message) {
    console.dir(message);
  });
});
