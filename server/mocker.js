var telemetryEmitter = require('./telemetry');
var globals = require('./globals');

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


module.exports = {
	beginMock: function() {
		setInterval(() => { tick(); }, 20);
	}
}
