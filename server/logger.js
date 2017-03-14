var fs = require('fs');
var os = require('os');
var globals = require('./globals');
var telemetryEmitter = require('./telemetry');

var fd = -1;

console.log("XXX" + globals.time + "XXX");

fs.open(globals.logFilename, 'a+', function(err, fd) {
	if (err) {
		console.log(err);
		console.log(globals.logFilename + ' already exists.');
	} else {
		telemetryEmitter.on('newPacket', function(packet) {
			fs.write(fd, packet.altimeter + ', ' + packet.latitude + ', ' + packet.longitude + ', ' + packet.accelerometer_x + ', ' + packet.accelerometer_y + ', ' 
			+ packet.accelerometer_z + ', ' + packet.yaw + ', ' + packet.pitch + ', ' + packet.roll + ', ' + packet.timestamp + ', ' + os.EOL);			
		});
	}	
});

console.log('Log file ' + globals.logFilename + 'opened.');
