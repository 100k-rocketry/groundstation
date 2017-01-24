// Scripts installed by node_modules
var express = require('express');
var path = require('path');

var logger = require('./logger');
var telemetryEmitter = require('./telemetry');

telemetryEmitter.on('newPacket', logger.logPacket);


/*
	Sets up routes from /scripts/... to the actual JavaScript files in node_modules.
*/
path = require('path');

/*	Put the path to the scripts here.
	This modules will iterate through this array, and for every element,
	create a route from ('/scripts' + filename) to the file ('./node_modules/' + scripts[i]).
*/

var port = process.env.GROUNDSTATION_PORT || 8080
// Get environment variables

var scripts = [
	"three/build/three.js",
];


// Set up the express app
var app = express();

// Loop through all scripts specified in the array above
for(var i = 0; i < scripts.length; i++) {
	
	// Break the path into parts, and add the current working directory and 'node_modules'
	var pathParts = [__dirname, 'node_modules'].concat(scripts[i].split('/'));
	
	// Get the name of the file, which is simply the last component in the path.
	// The route will be set to '/scripts/<filename>', and will serve the contents
	// specified above.
	var filename = pathParts[pathParts.length - 1];
	
	var filePath = path.join.apply(null, pathParts);
	
	console.log("Setting up script routes");
	console.log("  Adding route:");
	console.log("    Endpoint: /scripts/" + filename);
	console.log("    Filename: " + filePath);
	
	// Create the route
	app.get('/scripts/' + filename, function(req, res) {
		res.sendFile(filePath);
	});			
}	

console.log();

// Start up the websocket events
var expressWs = require('express-ws')(app);


app.ws('/', function(ws, req) {

	console.log("Acquired new connection from " + ws.upgradeReq.headers.origin);
		
	// The client listener handles sending a websocket packet to a specific
	// client whenever a new telemetry packet is received.
	// A new clientListner
	var clientListener = function(packet) {
		console.log();
		console.log("Sending packet");
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

	// When we get 
	telemetryEmitter.on('newPacket', clientListener);
	
	ws.on('close', function() {
		console.log("Closing connection from " + ws.upgradeReq.headers.origin);
		telemetryEmitter.removeListener('newPacket', clientListener);
	});
	

	
//	ws.on('message', function(msg) {
//		console.log(ws);
//	});
});

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

/*sensor.on("newPacket", function(packet) {
	ws.send(JSON.stringify(packet));
});*/