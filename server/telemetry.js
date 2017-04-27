var EventEmitter = require('events').EventEmitter;
var dataEmitter = require('./data');
var globals = require('./globals');

var telemetryEmitter = new EventEmitter();

// The offset that the payload 
var offset = 14;

var ADDRESS_START = 4
var ADDRESS_END = ADDRESS_START + 8

// Parses the response payload from the XBEE XCTU packet and triggers a "newPacket" event.
dataEmitter.on('data', function(data) {
	try {
		// mode
		var mode = data.readUInt8(1 + offset);
	
		// Figure out whether this packet is coming from the booster or the sustainer
		var part;
		if (globals.sustainerAddress.compare(data, ADDRESS_START, ADDRESS_END) === 0) {
			part = "Sustainer";
		}
		if (globals.boosterAddress.compare(data, ADDRESS_START, ADDRESS_END) === -1) {
			part = "Booster";
		}
		else {
			console.log("Invalid part address.");
		}
	
		// Mode 1 = Testing
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
	
		// Mode 2 = Armed
		if(mode === 2) {
			var altitude = data.readUInt8(2 + offset) * 65536;
			altitude += data.readUInt16LE(3 + offset);
			var latitude = data.readFloatLE(5 + offset);
			var longitude = data.readFloatLE(9 + offset);
			var accelerometer_x = data.readFloatLE(13 + offset);
			var accelerometer_y = data.readFloatLE(17 + offset);
			var accelerometer_z = data.readFloatLE(21 + offset);
			var yaw = data.readFloatLE(25 + offset);
			var pitch = data.readFloatLE(29 + offset);
			var roll = data.readFloatLE(33 + offset);
			var magnetometer_x = data.readFloatLE(37 + offset);
			var magnetometer_y = data.readFloatLE(41 + offset);
			var magnetometer_z = data.readFloatLE(45 + offset);
			var gps_altitude = data.readUInt16LE(49 + offset);
			var kalman_altitude = data.readUInt16LE(51 + offset);
			var kalman_velocity = data.readUInt16LE(53 + offset);
			var ematch_status = data.readUInt8(55 + offset);
	
			telemetryEmitter.emit('newPacket', {
				"mode": "Armed",
				"part": part,
				"altitude": altitude,
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
	
		// Mode 3 = Low power
		if(mode === 4) {
			var latitude = data.readFloatLE(2 + offset);
			var longitude = data.readFloatLE(6 + offset);
	
			telemetryEmitter.emit('newPacket', {
				"mode": "Low Power",
				"part": part,
				"latitude": latitude,
				"longitude": longitude,
				"timestamp": (new Date()).getTime()
			});
		} else {
			console.log("Invalid mode: " + mode);
		}
	} catch (err) {
		console.log("Could not parse packet data.");
		console.log(err);
	}
});

module.exports = telemetryEmitter;
