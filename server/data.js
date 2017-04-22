// Layer that abstracts getting data from the USB port
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var globals = require('./globals');


var dataEmitter = new EventEmitter();

var recoveryMode = false;

dataEmitter.altitude = 1300;
dataEmitter.longitude = (-106.97305);
dataEmitter.latitude = (32.9893);
dataEmitter.accelerometer_x = 0;
dataEmitter.accelerometer_y = 0;
dataEmitter.accelerometer_z = 0;
dataEmitter.yaw = 0;
dataEmitter.pitch = 90;
dataEmitter.roll = 0;
dataEmitter.numpackets = 0;

dataEmitter.sendPacket = function() {

	var buf = Buffer.alloc(48);
	// mode
	buf.writeUInt8(2, 0);
	// altimeter
	buf.writeUInt16LE(this.altitude, 1);
	buf.writeUInt8(0, 3);
	// lat
	buf.writeFloatLE(this.latitude, 4);
	// long
	buf.writeFloatLE(this.longitude, 8);
	// accel x
	buf.writeFloatLE(this.accelerometer_x, 12);
	// accel y
	buf.writeFloatLE(this.accelerometer_y, 16);
	// accel z
	buf.writeFloatLE(this.accelerometer_z, 20);
	// gyro x
	buf.writeFloatLE(this.yaw, 24);
	// gyro y
	buf.writeFloatLE(this.pitch, 28);
	// gyro z
	buf.writeFloatLE(this.roll, 32);

	// magnetometer
	// gyro x
	buf.writeFloatLE(this.yaw, 36);
	// gyro y
	buf.writeFloatLE(this.pitch, 40);
	// gyro z
	buf.writeFloatLE(this.roll, 44);
	if(this.numpackets == 10){
		this.numpackets = 0;
		this.longitude = (-106.97305);
		this.latitude = (32.9893);
		this.altitude = 1300;
	}
	this.numpackets +=1;
	this.emit('data', buf);

	this.altitude += 500;
	this.latitude += 0.00001;
	this.longitude -= 0.00001;
	this.accelerometer_x += 1;
	this.accelerometer_y -= 2;
	this.accelerometer_z += 3;
	this.yaw += 1;
	this.pitch += 2;
	this.roll += 3;
};

// Fire a fake packet every second
setInterval(() => { dataEmitter.sendPacket(); }, 1000);



// Tries to open the specified file.
// Attaches the data callback to the 'data' event.
// If the file closes for any reason during execution,
// automatically try to re-open the file
function createPersistentReadStream(filename, dataCallback) {
	var stream = fs.createReadStream(filename);

	// Stream opened successfully.
	stream.on('open', () => {
		console.log("Acquired connection to groundstation");
		// When we get data, call the data callback.
		stream.on('data', (d) => {
			dataCallback(new Buffer(d));
		});
	});

	// The stream didn't open correctly, so try again after a small delay.
	stream.on('error', (err) => {
		console.log("Stream error: " + err);
		setTimeout(() => { createPersistentReadStream(filename, dataCallback); }, 1000);
	});

	// File closed? That shouldn't happen, so try to re-open the stream.
	stream.on('close', () => {
		console.log("Lost connection to groundstation.");
		createPersistentReadStream(filename, dataCallback);
	});
}

var dataBuffer = Buffer.alloc(0);

// Appends the data to the buffer. If there is enough data to make a whole
// packet, then parse it.
function dataCallback(d) {
	var newDataBuffer = Buffer.concat([dataBuffer, d]);
	dataBuffer = newDataBuffer;

	if(dataBuffer.length > 23 && dataBuffer[0] == 2 && recoveryMode == false) {
		dataPacket = dataBuffer.slice(0, 24);
		dataBuffer = dataBuffer.slice(24);
		dataEmitter.emit("data", dataPacket);
	} else { // Enter recovery mode
		console.log("Entering recovery mode");
		recoveryMode = true;
		for(var i = 0; i < dataBuffer.length && recoveryMode == true; i++) {
			if(dataBuffer[i] == 2) {
				dataBuffer = dataBuffer.slice(i);
				recoveryMode = false;
			}
		}
	}
}

if(globals.useUSB) {
	createPersistentReadStream('/dev/ttyACM0', dataCallback);
}

module.exports = dataEmitter;
