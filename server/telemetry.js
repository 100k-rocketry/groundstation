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
		else if (globals.boosterAddress.compare(data, ADDRESS_START, ADDRESS_END) === 0) {
			part = "Booster";
		}
		else {
			console.log("Invalid part address.");
		}
	
		// Mode 1 = Testing
		if(mode === 1) {
			var ematchStatus = data.readUInt8(2 + offset);
			var temperature = data.readUInt8(3 + offset);
	
			telemetryEmitter.emit('newPacket', {
				"mode": "Testing",
				"part": part,
				"ematch_status": ematchStatus,
				"temperature": temperature,
				"timestamp": (new Date()).getTime()
			});
		}
	
		// Mode 2 = Armed
		if(mode === 2) {
//			console.log("Packet 2");
			var altitude = data.readUInt8(2 + offset) * 65536;
//			console.log("Packet 3");
			altitude += data.readUInt16LE(3 + offset);
//			console.log("Packet 5");
			var latitude = data.readFloatLE(5 + offset);

//			console.log("Packet 9");
			var longitude = data.readFloatLE(9 + offset);
			
//			console.log("Packet 13");
var accelerometer_x = data.readFloatLE(13 + offset);

//			console.log("Packet 17");
			var accelerometer_y = data.readFloatLE(17 + offset);
			
//			console.log("Packet 21");
var accelerometer_z = data.readFloatLE(21 + offset);

//			console.log("Packet 25");
			var yaw = data.readFloatLE(25 + offset);
			
//			console.log("Packet 29");
var pitch = data.readFloatLE(29 + offset);

//			console.log("Packet 33");
			var roll = data.readFloatLE(33 + offset);
			
//			console.log("Packet 37");
var magnetometer_x = data.readFloatLE(37 + offset);

//			console.log("Packet 41");
			var magnetometer_y = data.readFloatLE(41 + offset);
			
//			console.log("Packet 45");
var magnetometer_z = data.readFloatLE(45 + offset);

//			console.log("Packet 49");
			var gps_altitude = data.readUInt16LE(49 + offset);
			
//			console.log("Packet 51");
var kalman_altitude = data.readUInt16LE(51 + offset);

//			console.log("Packet 53");
			var kalman_velocity = data.readUInt16LE(53 + offset);
			
//			console.log("Packet 55");
var ematch_status = data.readUInt8(55 + offset);
	
			telemetryEmitter.emit('newPacket', {
				"mode": "Armed",
				"part": part,
				"altitude": altitude,
				"latitude": latitude / 100.0,
				"longitude": longitude / 100.0,
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
				"latitude": latitude / 100.0,
				"longitude": longitude / 100.0,
				"timestamp": (new Date()).getTime()
			});
		}
	} catch (err) {
		console.log("Could not parse packet data.");
		console.log(err);
	}
});

module.exports = telemetryEmitter;
