// Scripts installed by node_modules
var express = require('express');
var path = require('path');
var telemetryEmitter = require('./telemetry');
var mocker = require('./mocker');
var globals = require('./globals');
var fs = require('fs');
require('./logger');

// Get environment variables
var port = process.env.GROUNDSTATION_PORT || 80

// Set up the express app
var app = express();

// Start up the websocket events
var expressWs = require('express-ws')(app);

var allPackets = [];

var header = fs.readFileSync(path.join(__dirname, 'templates', 'header.html'), 'utf8');
var footer = fs.readFileSync(path.join(__dirname, 'templates', 'footer.html'), 'utf8');

telemetryEmitter.on("newPacket", (packet) => {
	// Really dirty way to deep copy the packet
	allPackets.push(JSON.parse(JSON.stringify(packet)));
	console.log(packet);
});

app.ws('/', function(ws, req) {

	console.log('Acquired new connection from ' + ws.upgradeReq.headers.origin);

	// The client listener handles sending a websocket packet to a specific
	// client whenever a new telemetry packet is received.
	// A new clientListner
	var clientListener = function(packet) {
		// Serialize the packet and send it to the client
		try {
			ws.send(JSON.stringify(packet));
		} catch(e) {
			// Something went wrong, so log the error and remove the event listener
			// so we don't try to send more packets in the future.
			console.log("Encountered error while sending message. Dropping connection.");
			console.log(e);
			telemetryEmitter.removeListener('newPacket', clientListener);
		}
	}
	
	// Send all the existing data to the client.	
	allPackets.forEach(function(packet) {
			clientListener(packet);
	});
	

	// When we get a new packet, send it to this client
	telemetryEmitter.on('newPacket', clientListener);

	// Make sure the remove the event listener when a client disconnects so
	// we don't try to send a packet to a client that doesn't exist.
	// (bad things happen if you try to do this)
	ws.on('close', function() {
		console.log("Closing connection from " + ws.upgradeReq.headers.origin);
		telemetryEmitter.removeListener('newPacket', clientListener);
	});
});

app.get('/', function(req, res, next) {
	res.redirect('/pages/index');
});

// If the client navigates to 'pages/page_nm', open the appropriate page
// from the templates folder and send it. If it's not found, then next()
// to the 404.
app.get('/pages/:page', function (req, res, next) {
	var page = req.params.page + '.html';

	var content = header;
	fs.readFile(path.join(__dirname, 'templates', page), (err, data) => {
		if(!err) {
			res.write(header);
			res.write(data);
			res.write(footer);
			res.end();
		} else {
			next();
		}
	});
});


app.get('/logs', function (req, res, next) {
	res.write(header);
	fs.readdir('logs', function(err, files) {
		files.forEach(function(f) {
			res.write('<a href="logs/' + f + '">' + f + '</a><br>');
		});
	});
	res.write(footer);
	res.end();
});


app.get('/logs/:log', function (req, res, next) {
	var log = req.params.log;

	if (req.params.log) {
		res.download (path.join(__dirname, 'logs', log));
	} else {
		next();
	}
});

app.get('/log', function(req, res) {
	res.sendFile(__dirname + globals.logFilename);
});

// Set up the static routes for the web server
app.use('/', express.static(path.join(__dirname, 'public')));

// All routes have failed, so send a 404.
// Make sure this is the LAST route specified.
app.get('*', function(req, res) {
	res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the web server
app.listen(port, function () {
	console.log("Listening on port", port);
});

// If we aren't getting data from the real groundstation, then do data mocking
if (!globals.useUSB) {
	mocker.beginMock();
}
