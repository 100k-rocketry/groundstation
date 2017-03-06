// Layer that abstracts getting data from the USB port
var EventEmitter = require("events").EventEmitter;
//var Buffer = quire('buffer');

var dataEmitter = new EventEmitter();

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
setInterval(() => { dataEmitter.sendPacket(); }, 1000);

module.exports = dataEmitter;
