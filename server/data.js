// Layer that abstracts getting data from the USB port
var EventEmitter = require("events").EventEmitter;
var usb = require('usb');
//var Buffer = quire('buffer');

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

	var buf = Buffer.alloc(24);
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
	buf.writeInt16LE(this.accelerometer_x, 12);
	// accel y
	buf.writeInt16LE(this.accelerometer_y, 14);
	// accel z
	buf.writeInt16LE(this.accelerometer_z, 16);
	// gyro x
	buf.writeInt16LE(this.yaw, 18);
	// gyro y
	buf.writeInt16LE(this.pitch, 20);
	// gyro z
	buf.writeInt16LE(this.roll, 22);

	this.emit("data", buf);

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
//setInterval(() => { dataEmitter.sendPacket(); }, 1000);

module.exports = dataEmitter;

var dataBuffer = Buffer.alloc(0);

usb.on('attach', function(device) {
	console.log(device);
	device.open();
	var iface = device.interface(1);
	iface.detachKernelDriver();
	iface.claim();
	console.log();
	console.log(iface.endpoints[0]);
	console.log();
	console.log(iface.endpoints[1]);
	var endpoint = iface.endpoints[1];

	endpoint.startPoll();

	endpoint.on('data', function(d) {
		dataBuffer = Buffer.concat([dataBuffer, d]);

		if(dataBuffer.length > 23) {
			//console.log(dataBuffer);
			dataPacket = dataBuffer.slice(0, 24);

			// Normal packet
			if(dataPacket[0] == 2 && recoveryMode == false) {
				dataEmitter.emit("data", dataPacket);
				dataBuffer = dataBuffer.slice(24);
				console.log(dataPacket);
			} else { // Enter recovery mode
				recoveryMode = true;
				for(var i = 0; i < dataBuffer.length; i++) {
					if(dataBuffer[i] == 2) {
						dataBuffer = dataBuffer.slice(i);
						recoveryMode = false;
					}
				}
			}
		}
	});
});
