// Scripts installed by node_modules
var express = require('express');
var path = require('path');

var port = 8080;

var app = express();


var expressWs = require('express-ws')(app);

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send("bar");
  });
  ws.send("foo");
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

// All routes have failed, so send a 404.
// Make sure this is the LAST route specified.
app.get('*', function(req, res) {
	res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the web server
app.listen(port, function () {
	console.log("Listening on port", port);
});