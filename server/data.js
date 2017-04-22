// Layer that abstracts getting data from the USB port
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var globals = require('./globals');
var xbee_api = require('xbee-api');

var dataEmitter = new EventEmitter();

var recoveryMode = false;

dataEmitter.altitude = 0;
dataEmitter.latitude = 45.0;
dataEmitter.longitude = 100;
dataEmitter.accelerometer_x = 0;
dataEmitter.accelerometer_y = 0;
dataEmitter.accelerometer_z = 0;
dataEmitter.yaw = 0;
dataEmitter.pitch = 90;
dataEmitter.roll = 0;

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

	this.emit('data', buf);

	this.altitude += 7;
	this.latitude += 0.01;
	this.longitude -= 0.01;
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

// A collection of all the bytes that we have read from the serial port
// This is unescaped.
var dataBuffer = Buffer.alloc(0);
// The packet that we are building up from the dataBuffer
// This data is escaped.
var dataPacket;
// Whether the next byte should be escaped.
// This is declared in this scope because we may need to hold on
// to this information between packets.
var isEscape = false;


// Appends the data to the buffer. If there is enough data to make a whole
// packet, then parse it.
function dataCallback(d) {

	// Count the number of characters that need to be escaped
	var escapedCharacters = 0;
	for (var i = 0; i < d.length; i++) {
		if (d[i] === 0x7D) {
			escapedCharacters++;
		}
	}

	// Create a new buffer to hold all of the data after the
	// characters have been escaped
	var escapedData = Buffer.alloc(d.length - escapedCharacters);
	var escapedIndex = 0;

	// Apply the escape-character logic to the incoming data
	for (var i = 0; i < d.length; i++) {
		if (isEscape) {
			escapedCharacters[escapedIndex++] = d[i] ^ 0x20;
			isEscape = false;
		} else if (d[i] == 0x7D) {
			isEscape = true;
		} else {
			escapedCharacters[escapedIndex++] = d[i];
		}
	}

	// Add the escaped data to the
	dataBuffer = Buffer.concat([dataBuffer, d]);

	// We need at least three bytes.
	// The first two bytes should always be 0x7e00 to denote
	// the start of a new packet. The third byte is the length.
	// Once we have the length we can grab the whole packet and
	// process it.
	if (dataBuffer.length >= 3) {
		var length = dataBuffer[2];
		// If we have the first two bytes (0x7e00 + the length byte)
		// and the checksum (for a total of four bytes), plus
		// the data
		if (dataBuffer.length >= length + 4)
	}





	/*var newDataBuffer = Buffer.concat([dataBuffer, d]);
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
		}*/
		}
}

if(globals.useUSB) {
	createPersistentReadStream('/dev/ttyACM0', dataCallback);
}

module.exports = dataEmitter;
