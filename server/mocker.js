var telemetryEmitter = require('./telemetry');
var globals = require('./globals');
var fs = require('fs');

var lastTimestamp = 0;

var booster = {
	"mode": "Armed",
	"part": "Booster",
	"altitude": 1300,
	"latitude": 32.9893,
	"longitude": -106.97305,
	"accelerometer_x": 0,
	"accelerometer_y": 0,
	"accelerometer_z": 0,
	"magnetometer_x": 0,
	"magnetometer_y": 0,
	"magnetometer_z": 0,
	"yaw": 0,
	"pitch": 0,
	"roll": 0,
	"gps_altitude": 1300,
	"kalman_altitude": 300,
	"kalman_velocity": 0,
	"ematch_status": 0
};

var sustainer = {
	"mode": "Armed",
	"part": "Sustainer",
	"altitude": 1300,
	"latitude": 32.9893,
	"longitude": -106.97305,
	"accelerometer_x": 0,
	"accelerometer_y": 0,
	"accelerometer_z": 0,
	"magnetometer_x": 0,
	"magnetometer_y": 0,
	"magnetometer_z": 0,
	"yaw": 0,
	"pitch": 0,
	"roll": 0,
	"gps_altitude": 1300,
	"kalman_altitude": 1300,
	"kalman_velocity": 0,
	"ematch_status": 0
};

function tick() {
	booster.altitude += .0100;
	booster.latitude += 0.0000001;
	booster.longitude += 0.0000001;
	booster.accelerometer_x += 1;
	booster.accelerometer_y += 2;
	booster.accelerometer_z += 3;
	booster.magnetometer_x += 4;
	booster.magnetometer_y += 5;
	booster.magnetometer_z += 6;
	booster.yaw += 0.0004;
	booster.pitch += 0.0006;
	booster.roll += 0.000054;
	booster.gps_altitude += 999;
	booster.kalman_altitude += 998;
	booster.kalman_velocity += 1;
	booster.ematch_status += 2;
	booster.timestamp = (new Date()).getTime();
	telemetryEmitter.emit('newPacket', booster);

	sustainer.altitude += .00100;
	sustainer.latitude += 0.0000001;
	sustainer.longitude += 0.0000001;
	sustainer.accelerometer_x += 1;
	sustainer.accelerometer_y += 2;
	sustainer.accelerometer_z += 3;
	sustainer.magnetometer_x += 4;
	sustainer.magnetometer_y += 5;
	sustainer.magnetometer_z += 6;
	sustainer.yaw += 0.0004;
	sustainer.pitch += 0.0006;
	sustainer.roll += 0.000054;
	sustainer.gps_altitude += 999;
	sustainer.kalman_altitude += 998;
	sustainer.kalman_velocity += 1;
	sustainer.ematch_status += 2;
	sustainer.timestamp = (new Date()).getTime();

	if ((sustainer.altitude / 100) % 2 == 0) {
		sustainer.gps_altitude = 0;

	} else {
		sustainer.gps_altitude = sustainer.kalman_altitude + 1000;
	}
	telemetryEmitter.emit('newPacket', sustainer);
}
//part, mode, altitude, latitude, longitude, accelerometer_x, accelerometer_y, accelerometer_z, yaw, pitch, roll, magnetometer_x, magnetometer_y, magnetometer_z, gps_altitude, kalman_altitude, kalman_velocity, ematch_status, temperature, timestamp
function replayPacket(lines, index) {
	var line = lines[index].split(',');
	if (line.length > 0) {
		var packet = {
			"mode": line[1].trim(),
			"part": line[0].trim(),
			"altitude": line[2].trim(),
			"latitude": line[3].trim(),
			"longitude": line[4].trim(),
			"accelerometer_x": line[5].trim(),
			"accelerometer_y": line[6].trim(),
			"accelerometer_z": line[7].trim(),
			"magnetometer_x": line[11].trim(),
			"magnetometer_y": line[12].trim(),
			"magnetometer_z": line[13].trim(),
			"yaw": line[8].trim(),
			"pitch": line[9].trim(),
			"roll": line[10].trim(),
			"gps_altitude": line[14].trim(),
			"kalman_altitude": line[15].trim(),
			"kalman_velocity": line[16].trim(),
			"ematch_status": line[17].trim(),
			"temperature": line[18].trim(),
			"timestamp": line[19].trim()
		};

		lastTimestamp = packet.timestamp;
		//console.log(packet);

		//setTimeout(packet.timeout)

		if (index < lines.length - 2) {
			var nextLine = lines[index + 1].split(',');
			var delay = nextLine[19] - line[19];
			console.log(delay);
			//replayPacket(lines, index + 1);
			telemetryEmitter.emit('newPacket', packet);
			if (line[19] < globals.replayStartTime) {
				setTimeout(replayPacket, 1, lines, index + 1)
			} else {
				setTimeout(replayPacket, delay, lines, index + 1);
			}
		} else {
			//console.log(lines[index]);
		}

	}
}

if (globals.replayFile === "") {
			setInterval(() => { tick(); }, 100);
			module.exports = {
				beginMock: function() {
		}
	}
} else {
	module.exports = {
		beginMock: function() {
			var csv = fs.readFile(globals.replayFile, 'utf8', function(err, data) {
				if (!err) {
					replayPacket(data.split('\n'), 1);
				} else {
					console.log(err);
				}
			});
		}
	}
}
