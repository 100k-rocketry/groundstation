var fs = require('fs');
var os = require('os');

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
		fs.write(fd, packet.sensor + ', ' + packet.value + ', ' + packet.timestamp + os.EOL);
	}
	
	var jsoncsv = require('json-csv')

jsoncsv.csvBuffered(data, options, callback)

var callback = function(err,csv) {
 //csv contains string that are already converted to CSV format
}

var jsoncsv = require('json-csv)

var readable_source = <emits data row by row>

readable_source.pipe(jsoncsv.csv(info))
}