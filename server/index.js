// Scripts installed by node_modules
var express = require('express');
var path = require('path');
var telemetryEmitter = require('./telemetry');
var mocker = require('./mocker');
var globals = require('./globals');
var panel = require('./panel');
var fs = require('fs');
var pstream = require('./persistentstream');

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

var panelStats = {
	booster: {
		lat: 0,
		long: 0,
		alt: 0,
		accel: 0, // in gravities
		ematch: false // False when ematch has not been ignited, true otherwise
	},
	sustainer: {
		lat: 0,
		long: 0,
		alt: 0,
		accel: 0,
		ematch: false
	}
};

function updatePanelStat(panelStat, packet) {
	if (packet.mode === "Armed") {
		panelStat.lat = packet.latitude;
		panelStat.long = packet.longitude;
		panelStat.alt = packet.altitude;
		panelStat.accel = Math.sqrt(Math.pow(packet.accelerometer_x, 2) + Math.pow(packet.accelerometer_y, 2) + Math.pow(packet.accelerometer_z, 2)) / 9.8;
	}
}

var lastPanelUpdate = 0;
var lastBoosterTimestamp = 0;
var lastSustainerTimestamp = 0;

// Booster ematch = 0x0f
// Sustainer ematch = 0x7f

// Every time we get a new packet, set the comms light to
// (for the appropriate booster/sustainer light)
// and if the ematch status equals the special n
telemetryEmitter.on("newPacket", (packet) => {
	// Really dirty way to deep copy the packet
	allPackets.push(JSON.parse(JSON.stringify(packet)));
	var now = (new Date()).getTime();
	var armed = panel.isArmed();
	
	if (packet.part === "Booster") {
		updatePanelStat(panelStats.booster, packet);
		if (packet.ematch_status !== 0 && panelStats.booster.ematch === false) {
			panelStats.booster.ematch = true;
			panel.setLight("bignite", "on");
		}

		if(packet.mode === "Armed" && armed === false || packet.mode === "Testing" && armed === true) {
			panel.setBoosterError();
			console.log("Setting booster error");
		} else {
			panel.removeBoosterError();
		}

		lastBoosterTimestamp = now;

	} else if (packet.part === "Sustainer") {
		updatePanelStat(panelStats.sustainer, packet); 
		if (packet.ematch_status !== 0 && panelStats.sustainer.ematch === false) {
			panelStats.sustainer.ematch = true;	
			panel.setLight("signite", "on");
		}

		if (packet.mode === "Armed" && armed === false || packet.mode === "Testing" && armed === true) {
			panel.setSustainerError();
		} else {
			panel.removeSustainerError();
		}

		lastSustainerTimestamp = now;
	}	
});


// Turns the lights off if we haven't received a packet in a second or so
function turnLightsOnOff() {
	var now = (new Date()).getTime();

	if (now - lastBoosterTimestamp > 2000) {
		panel.setLight("bcomm", "off");
		panel.setLight("bignite", "off");
		panelStats.booster.ematch = false;
		//panel.setLight("bignition", "off");
	} else {
		panel.setLight("bcomm", "on");
	}


	if (now - lastSustainerTimestamp > 2000) {
		panel.setLight("scomm", "off");

		panel.setLight("signite", "off");
		panelStats.sustainer.ematch = false;
		//panel.setLight("signition", "off");
	} else {
		panel.setLight("scomm", "on");
	}
}


// For testing the LCD
var kirbyState = 0;

var kirbyDanceStates = [
	" (>'-')>",
	"<('-'<)",
	" (>'-')>",
	"<('-'<)",
	"^('-')^",
	"v('-')v",
	" (^-^)"
];

function kirbyDance() {
	panel.setLine('4', '      ' + kirbyDanceStates[kirbyState]);
	kirbyState += 1;
	if (kirbyState >= kirbyDanceStates.length) {
		kirbyState = 0;
	}
}

function updatePanel(part, line) {
	var now = (new Date()).getTime();
	try {
		var latStr = part.lat.toFixed(8);
		latStr = ' '.repeat(13 - latStr.length) + latStr;
		var longStr = part.long.toFixed(8);
		longStr = ' '.repeat(13 - longStr.length) + longStr;
		var altStr = String(part.alt);
		altStr = ' '.repeat(5 - altStr.length) + altStr;
		var accelStr = part.accel.toFixed(2);
		accelStr = ' '.repeat(5 - accelStr.length) + accelStr;

		var line1 = latStr + ' ' + altStr + 'm';
		var line2 = longStr + ' ' + accelStr + 'g';

		panel.setLine(line, line1);
		panel.setLine(line + 1, line2);	
	} catch (err) {
		console.log("Error formatting panel string.");
		console.log(err);		
	}
}


// Every 100ms, check if we should turn the sustainer lights off
setInterval(turnLightsOnOff, 100);
setInterval(updatePanel, 1000, panelStats.sustainer, 1);
setInterval(updatePanel, 1000, panelStats.booster, 3);

//setInterval(kirbyDance, 500);


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
			if (f.indexOf('.csv') > -1) {
				res.write('<a href="logs/' + f + '">' + f + '</a><br>');
			}
		});
		res.write(footer);
		res.end();
	});
});


app.get('/logs/:log', function (req, res, next) {
	var log = req.params.log;
	if (req.params.log && log.indexOf('.csv') > -1) {
		res.download (path.join(__dirname, 'logs', log));
	} else {
		next();
	}
});

// Gets the current log
app.get('/currentlog', function(req, res) {
	res.sendFile(path.join(__dirname, 'logs', globals.logFilename));
});

// When a post request is sent to this URL,
// it shuts down the server.
//app.post('/controls/shutdown', function(req, res) {
//	console.log('Shutting down');
//	var spawn = require('child_process');
//	spawn.spawnSync('/sbin/shutdown', ['-h', 'now']);
//});

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
