// Layer that abstracts getting data from the USB port
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var globals = require('./globals');
var spawn = require('child_process');
var pstream = require('./persistentstream');

var dataEmitter = new EventEmitter();

// A collection of all the bytes that we have read from the serial port
// This is unescaped.
var dataBuffer = Buffer.alloc(0);
// Whether the next byte should be escaped.
// This is declared in this scope because we may need to hold on
// to this information between packets.
var isEscape = false;
// insidePacket is set to true if we are currently inside
// (processing a packet). It should pretty much always be
// true unless we are at the first byte of a packet or
// something went wrong.
var insidePacket = false;

// Appends the data to the buffer. If there is enough data to make a whole
// packet, then parse it.
function dataCallback(d) {

	console.log(d);

	if (insidePacket === false && dataBuffer.length > 0 && dataBuffer[0] === 0x7e) {
		insidePacket = true;
	}

	// We're not inside a packet and we're not looking at a packet
	// header, so something went wrong. Look for the 7e.
	if (insidePacket === false && d[0] != 0x7e) {
		var startPosition = -1;
		for (var i = 0; i < d.length; i++) {
			if (d[i] === 0x7e) {
				startPosition = i;
				break;
			}
		}

		// If we found a 0x7e, then cut the packet so that's the
		// new start. If not, then just return from the callback,
		// because there's nothing we can do until the next
		// packet comes in.
		if (startPosition !== -1) {
			d = d.slice(startPosition);
		} else {
			return;
		}
	}

	// If we are at the beginning of a packet, then note that fact.
	if (d[0] === 0x7e) {
		insidePacket = true;
	}

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
			escapedData[escapedIndex] = d[i] ^ 0x20;
			escapedIndex++;
			isEscape = false;
		} else if (d[i] === 0x7D) {
			isEscape = true;
		} else {
			escapedData[escapedIndex] = d[i];
			escapedIndex++;
		}
	}

	// Add the escaped data to the data buffer
	dataBuffer = Buffer.concat([dataBuffer, escapedData]);

	// We need at least three bytes.
	// The first two bytes should always be 0x7e to denote
	// the start of a new packet. The third byte is the length.
	// Once we have the length we can grab the whole packet and
	// process it.
	if (dataBuffer.length >= 3) {
		var length = dataBuffer[2] + 4;
		// We have the entire RF data (the length attribute)
		// and the 15 bytes of header data, so we can process
		// the packet.
		if (dataBuffer.length >= length) {
			var dataPacket = dataBuffer.slice(0, length);
			dataBuffer = dataBuffer.slice(length);
			dataEmitter.emit("data", dataPacket);
			insidePacket = false;
		}
	}
}

// If we are actually connecting to the physical groundstation, then open the device.
if(globals.useUSB) {
	pstream.createPersistentReadStream(globals.deviceName, globals.baud, dataCallback);
}

module.exports = dataEmitter;
