var EventEmitter = require('events').EventEmitter;
var dataEmitter = require('./data');
var globals = require('./globals');

var telemetryEmitter = new EventEmitter();

// The offset that the payload 
var offset = 14;

// Parses the response payload from the XBEE XCTU packet and triggers a "newPacket" event.
dataEmitter.on('data', function(data) {
	try {
		// mode
		var mode = data.readUInt8(1 + offset);
	
		// Figure out whether this packet is coming from the booster or the sustainer
		var part;
		if (globals.sustainerAddress.compare(data, 4, 12) === 0) {
			part = "Sustainer";
		}
		if (globals.boosterAddress.compare(data, 4, 12) === 0) {
			part = "Booster";
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
			var latitude = data.readFloatBE(2 + offset);
			var longitude = data.readFloatBE(6 + offset);
	
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
});

module.exports = telemetryEmitter;
