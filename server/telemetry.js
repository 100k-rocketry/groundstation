var EventEmitter = require("events").EventEmitter;
var SerialPort = require("usb");
 
var telemetryEmitter = new EventEmitter();

// This gets triggered when a new packet comes in.
/*
sensorEmitter.on("newPacket", function () {
    console.log("event has occured");
});
*/

telemetryEmitter.altitude = 0;
telemetryEmitter.timestamp = 0;

// Sends a fake packet
telemetryEmitter.sendPacket = function() {
	this.emit("newPacket", 
		{
			"altimeter": 11,
			"latitude": 45.11,
			"longitude": 100.12,
			"accelerometer_x": 1,
			"accelerometer_y": 2,
			"accelerometer_z": 3,
			"yaw": 4,
			"pitch": 5,
			"roll": 6,
			"timestamp": 7
		});
	this.altitude += 10;
	this.timestamp += 1;
};

// Fire a fake packet every second
setInterval(() => { telemetryEmitter.sendPacket(); }, 1000);

module.exports = telemetryEmitter;

/* SERIAL PORT STUFF: WORK IN PROGRESS */

/*var port = new SerialPort('COM1');

port.on('open', function() {
	console.log('Connected to serial port');
});*/

