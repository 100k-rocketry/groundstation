var fs = require('fs');
var os = require('os');
var path = require('path');
var globals = require('./globals');
var telemetryEmitter = require('./telemetry');

var fd = -1;


// Only create a log file if we are using real data
if (globals.useUSB) {

	// Open the log file and attach an event handler that writes the telemetry to the log
	// when a new packet is received.
	fs.open(path.join(__dirname, 'logs', globals.logFilename), 'a+', function(err, fd) {
		if (err) {
			console.log(err);
			console.log(globals.logFilename + ' already exists.');
		} else {
			// Write the headers to the file
			fs.write(fd, "part, mode, altitude, latitude, longitude, accelerometer_x, accelerometer_y, accelerometer_z, yaw, pitch, roll, magnetometer_x, magnetometer_y, magnetometer_z, gps_altitude, kalman_altitude, kalman_velocity, ematch_status, temperature, timestamp" + os.EOL);
			// Attach an event handler that writes new packet data
			telemetryEmitter.on('newPacket', function(packet) {
				fs.write(fd, packet.part + ', ' + packet.mode + ', ' + packet.altitude + ', ' + packet.latitude + ', ' + packet.longitude + ', ' + packet.accelerometer_x + ', ' + packet.accelerometer_y + ', '
				+ packet.accelerometer_z + ', ' + packet.yaw + ', ' + packet.pitch + ', ' + packet.roll + ', ' + packet.magnetometer_x + ', ' + packet.magnetometer_y + ', ' + packet.magnetometer_z + ', ' + packet.gps_altitude + ', ' + packet.kalman_altitude + ', ' + packet.kalman_velocity + ', ' + packet.ematch_status + ', ' + packet.temperature + ', ' + packet.timestamp + os.EOL);
			});
		}
	});

	console.log('Log file ' + globals.logFilename + ' opened.');
}
