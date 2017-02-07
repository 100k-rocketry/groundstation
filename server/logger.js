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
	//	fs.write(fd, packet.sensor + ', ' + packet.value + ', ' + packet.timestamp + os.EOL);
	//}
		fs.write(fd, packet.altimeter + ', ' + packet.latitude + ', ' + packet.longitude + ', ' + packet.accelerometer_x + ', ' + packet.accelerometer_y + ', ' + packet.accelerometer_z ', ' + packet.yaw + ', ' + packet.pitch + ', ' + packet.roll + ', ' + packet.timestamp + ', ' + os.EOL  );
		}
	/*jsoncsv.csvBuffered([packet], {
  fields : [
    {
        name : 'altimeter',
        label : 'altimeter'
      
	},
    {
        name : 'latitude',
        label : 'latitude'
    },
    {
        name : 'longitude',
        label : 'longitude'
    },
	{
        name : 'accelerometer_x',
        label : 'accelerometer_x'
    },
	{
        name : 'accelerometer_y',
        label : 'accelerometer_y'
    },
	{
       name : 'accelerometer_z',
        label : 'accelerometer_z'
    },
	{
        name : 'yaw',
        label : 'yaw'
    },
	{
        name : 'pitch',
        label : 'pitch'
    },
	{
        name : 'roll',
        label : 'roll'
    },
	{
       name : 'timestamp',
        label : 'timestamp'
    }
	
  ]},
  function(err,csv) {
    console.log(csv);
});*/
}