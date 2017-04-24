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

var sustainerAddress = Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x5A,0xD2,0x0B]);
var boosterAddress = Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x25,0xD1,0xF6]);
var offset = 14;

dataEmitter.on('data', function(data) {
	console.log(data);
	try {
	// mode
	mode = data.readUInt8(1 + offset);

	var part;
	console.log("WHIDF");
	console.log(data.slice(4, 12));
	console.log(sustainerAddress);
	if (sustainerAddress.compare(data, 4, 12) === 0) {
		part = "Sustainer";
	}
	if (boosterAddress.compare(data, 4, 12) === 0) {
		part = "Booster";
	}

	console.log("MODE " + mode);
	console.log(data);

	if(mode === 1) {
		var ematchStatus = data.readUInt8(2 + offset);
		var temperature = data.readUInt8(2 + offset);

		telemetryEmitter.emit('newPacket', {
			"mode": "Testings",
			"part": part,
			"ematch_status": ematchStatus,
			"temperature": temperature,
			"timestamp": (new Date()).getTime()
		});
	}

	if(mode === 2) {
		var altitude = data.readUInt8(2 + offset) * 65536;
		altitude += data.readUInt16BE(3 + offset);
		var latitude = data.readFloatBE(5 + offset);
		var longitude = data.readFloatBE(9 + offset);
		var accelerometer_x = data.readFloatBE(13 + offset);
		var accelerometer_y = data.readFloatBE(17 + offset);
		var accelerometer_z = data.readFloatBE(21 + offset);
		var yaw = data.readFloatBE(25 + offset);
		var pitch = data.readFloatBE(29 + offset);
		var roll = data.readFloatBE(33 + offset);
		var magnetometer_x = data.readFloatBE(37 + offset);
		var magnetometer_y = data.readFloatBE(41 + offset);
		var magnetometer_z = data.readFloatBE(45 + offset);
		var gps_altitude = data.readUInt16BE(49 + offset);
		var kalman_altitude = data.readUInt16BE(51 + offset);
		var kalman_velocity = data.readUInt16BE(53 + offset);
		var ematch_status = data.readUInt8(55 + offset);

		telemetryEmitter.emit('newPacket', {
			"mode": "Armed",
			"part": part,
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
			"gps_altitude": gps_altitude,
			"kalman_altitude": kalman_altitude,
			"kalman_velocity": kalman_velocity,
			"ematch_status": ematch_status,			
			"timestamp": (new Date()).getTime()
		});
	}

	// Low power
	if(mode === 4) {
		latitude = data.readFloatBE(2 + offset);
		longitude = data.readFloatBE(6 + offset);

		telemetryEmitter.emit('newPacket', {
			"mode": "Low Power",
			"part": part,
			"latitude": latitude,
			"longitude": longitude,
			"timestamp": (new Date()).getTime()
		});
	}
	} catch (err) {
		console.log("Could not parse packet data.");
		console.log(err);
	}



	console.log(mode, altitude, latitude, longitude, accelerometer_x, accelerometer_y, accelerometer_z, yaw, pitch, roll);
});

module.exports = telemetryEmitter;
