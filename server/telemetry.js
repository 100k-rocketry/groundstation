var EventEmitter = require("events").EventEmitter;
var dataEmitter = require("./data");
var usb = require('usb');

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
			"latitude": this.latitude,
			"longitude": this.longitude,
			"accelerometer_x": this.accelerometer_x,
			"accelerometer_y": this.accelerometer_y,
			"accelerometer_z": this.accelerometer_z,
			"yaw": this.yaw,
			"pitch": this.pitch,
			"roll": this.roll,
			"timestamp": this.timestamp
		});
	this.altitude += 10;
	this.timestamp += 1;
	this.latitude += 0.01;
	this.longitude -= 0.01;
	this.accelerometer_x += 0.03;
	this.accelerometer_y -= 0.02;
	this.accelerometer_z += 1.134;
	this.yaw += 0.0134;
	this.pitch += 0.01934;
	this.roll += 0.014343;
};

// Fire a fake packet every second
//setInterval(() => { telemetryEmitter.sendPacket(); }, 1000);

dataEmitter.on('data', function(data) {
	var mode = -1;
	var altitude = -1;
	var latitude = -1;
	var longitude = -1;
	var accelerometer_x = -1;
	var accelerometer_y = -1;
	var accelerometer_z = -1;
	var yaw = -1;
	var pitch = -1;
	var roll = -1;	
	
	// mode
	mode = data.readUInt8(0);
	// altimeter
	altitude = data.readUInt16LE(1);
	altitude += data.readUInt8(3) * 65536;
	// lat
	latitude = data.readFloatLE(4);
	// long
	longitude = data.readFloatLE(8);
	// accel x
	accelerometer_x = data.readInt16LE(12);
	// accel y
	accelerometer_y = data.readInt16LE(14);
	// accel z
	accelerometer_z = data.readInt16LE(16);
	// gyro x
	yaw = data.readInt16LE(18);
	// gyro y
	pitch = data.readInt16LE(20);
	// gyro z
	roll = data.readInt16LE(22);
	
	telemetryEmitter.emit('newPacket', {
		"altimeter": altitude,
		"latitude": latitude,
		"longitude": longitude,
		"accelerometer_x": accelerometer_x,
		"accelerometer_y": accelerometer_y,
		"accelerometer_z": accelerometer_z,
		"yaw": yaw,
		"pitch": pitch,
		"roll": roll,
		"timestamp": 0
	});
	
	console.log(mode, altitude, latitude, longitude, accelerometer_x, accelerometer_y, accelerometer_z, yaw, pitch, roll);
});

module.exports = telemetryEmitter;

usb.on('attach', function(device) {
	device.open();
	var iface = device.interface(1);
	iface.detachKernelDriver();
	iface.claim();
	var endpoint = iface.endpoints[0];

	endpoint.startPoll();
	endpoint.on('data', function(d) {
		console.log(d);
	});
});
