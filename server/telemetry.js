var EventEmitter = require("events").EventEmitter;
var SerialPort = require("usb");
 
var telemetryEmitter = new EventEmitter();

telemetryEmitter.altitude = 0;
telemetryEmitter.timestamp = 0;
telemetryEmitter.latitude = 45.0;
telemetryEmitter.longitude = 100;
telemetryEmitter.accelerometer_x = 0;
telemetryEmitter.accelerometer_y = 0;
telemetryEmitter.accelerometer_z = 0;
telemetryEmitter.yaw = 0;
telemetryEmitter.pitch = 90;
telemetryEmitter.roll = 0;

// Sends a fake packet
telemetryEmitter.sendPacket = function() {
	this.emit("newPacket", 
		{
			"altimeter": this.altitude,
			"latitude": 45.11,
			"longitude": 100.12,
			"accelerometer_x": 1,
			"accelerometer_y": 2,
			"accelerometer_z": 3,
			"yaw": 4,
			"pitch": 5,
			"roll": 6,
			"timestamp": this.timestamp
		});
telemetryEmitter.altitude += 10;
telemetryEmitter.timestamp += 1;
telemetryEmitter.latitude += 0.01;
telemetryEmitter.longitude -= 0.01;
telemetryEmitter.accelerometer_x += 0.03;
telemetryEmitter.accelerometer_y -= 0.02;
telemetryEmitter.accelerometer_z += 1.134;
telemetryEmitter.yaw += 0.0134;
telemetryEmitter.pitch += 0.01934;
telemetryEmitter.roll += 0.014343;
};

// Fire a fake packet every second
setInterval(() => { telemetryEmitter.sendPacket(); }, 1000);

module.exports = telemetryEmitter;
