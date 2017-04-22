var EventEmitter = require('events').EventEmitter;
var dataEmitter = require('./data');
var globals = require('./globals');

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
	console.log("Sendint a packet");
};

// Fire a fake packet every second

if(!globals.useUSB) {
	setInterval(() => { telemetryEmitter.sendPacket(); }, 1000);
}

dataEmitter.on('data', function(data) {
	// mode
	mode = data.readUInt8(0);

	if(mode === 1) {
		var boosterEMatch = data.readUInt8(1);
		var sustainerEMatch = data.readUInt8(2);
		var temperature = data.readUInt8(3);

		telemetryEmitter.emit('newPacket', {
			"mode": "Testings",
			"part": "sustainer",
			"booster_e_match": boosterEMatch,
			"sustainer_e_match": sustainerEMatch,
			"temperature": temperature,
			"timestamp": (new Date()).getTime()
		});
	}

	if(mode === 2) {
		var altitude = data.readUInt16LE(15);
		altitude += data.readUInt8(17) * 65536;
		var latitude = data.readFloatLE(18);
		var longitude = data.readFloatLE(22);
		var accelerometer_x = data.readFloatLE(26);
		var accelerometer_y = data.readFloatLE(30);
		var accelerometer_z = data.readFloatLE(34);
		var yaw = data.readFloatLE(38);
		var pitch = data.readFloatLE(42);
		var roll = data.readFloatLE(46);
		var magnetometer_x = data.readFloatLE(50);
		var magnetometer_y = data.readFloatLE(54);
		var magnetometer_z = data.readFloatLE(58);

		telemetryEmitter.emit('newPacket', {
			"mode": "Armed",
			"part": "sustainer",
			"altimeter": altitude,
			"latitude": latitude,
			"longitude": longitude,
			"accelerometer_x": accelerometer_x,
			"accelerometer_y": accelerometer_y,
			"accelerometer_z": accelerometer_z,
			"magnetometer_x": magnetometer_x,
			"magnetometer_y": magnetometer_z,
			"magnetometer_z": magnetometer_x,
			"yaw": yaw,
			"pitch": pitch,
			"roll": roll,
			"timestamp": (new Date()).getTime()
		});
	}

	if(mode === 4) {
		latitude = data.readFloatLE(1);
		longitude = data.readFloatLE(5);

		telemetryEmitter.emit('newPacket', {
			"mode": "Low Power",
			"part": "sustainer",
			"latitude": latitude,
			"longitude": longitude,
			"timestamp": (new Date()).getTime()
		});
	}



	//console.log(mode, altitude, latitude, longitude, accelerometer_x, accelerometer_y, accelerometer_z, yaw, pitch, roll);
});

module.exports = telemetryEmitter;
