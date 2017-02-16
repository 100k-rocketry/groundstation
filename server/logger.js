var fs = require('fs');
var os = require('os');
var jsoncsv = require('json-csv');

var logfile = process.env.GROUNDSTATION_LOGFILE || 'gs.log'

var fd = -1;


fs.open(logfile, 'a+', function(err, newfd) {
	if (err) {
		console.log(logfile + ' already exists.');
		return;
	} else {
		fd = newfd;
	}	
});

console.log('Log file ' + logfile + 'opened.');

module.exports.logPacket = function(packet) {
	if (fd != -1) {
		fs.write(fd, packet.altimeter_1 + ', ' + packet.latitude_1 + ', ' + packet.longitude_1 + ', ' + packet.accelerometer_x_1 + ', ' + packet.accelerometer_y_1 + ', ' 
		+ packet.accelerometer_z_1 + ', ' + packet.yaw_1 + ', ' + packet.pitch_1 + ', ' + packet.roll_1 + ', ' + packet.timestamp_1 + ', ' + os.EOL);
		
		fs.write(fd, packet.altimeter_2 + ', ' + packet.latitude_2 + ', ' + packet.longitude_2 + ', ' + packet.accelerometer_x_2 + ', ' + packet.accelerometer_y_2 + ', ' 
		+ packet.accelerometer_z_2 + ', ' + packet.yaw_2 + ', ' + packet.pitch_2 + ', ' + packet.roll_2 + ', ' + packet.timestamp_2 + ', ' + os.EOL);
		}
	
}