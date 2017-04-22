// Scripts installed by node_modules
var express = require('express');
var path = require('path');
var telemetryEmitter = require('./telemetry');

// Get environment variables
var port = process.env.GROUNDSTATION_PORT || 8080

// Set up the express app
var app = express();

// Start up the websocket events
var expressWs = require('express-ws')(app);

telemetryEmitter.on("newPacket", (packet) => {
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
