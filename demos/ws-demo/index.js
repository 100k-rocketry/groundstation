// Scripts installed by node_modules
var express = require('express');
var path = require('path');
var WebSocketServer = require('ws').Server;

var port = 8080;

var wss = new WebSocketServer({port: 8081});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

var app = express();
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