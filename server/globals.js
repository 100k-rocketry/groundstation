/*

 *** FOR REAL LAUNCHES, ENSURE THAT useUSB IS SET TO TRUE ***

 */


var now = new Date();

module.exports = {
	// Set this to false to use the mocked data instead of trying to connect to the actual telemtry device
	useUSB: false,
	// Replays the specified log file.
	// If set to '', then creates fake data instead of replaying.
	// If useUSB is set to true, then replayFile and replayStartTime are ignored
	replayFile: 'logs/log-2017-04-27T19.53.51.120Z.csv',
	// When replaying a file, the replay will fast forward to this timestamp
	replayStartTime: 1493323077006,
	// The time that the server started up (used for the log filename)
	time: now.toISOString(),
	logFilename: ('log-' + now.toISOString() + '.csv').replace(/:/g, '.'),
	// The MAC addresses of the sustainer and booster
	sustainerAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x5A,0xD2,0x0B]),
	boosterAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x25,0xD1,0xF6]),
	// Baud rate for the USB device
	baud: 115200,
	// The device that we are receiving telemetry from
	deviceName: '/dev/ttyUSB0',
	panelDeviceName: '/dev/ttyACM0',
	panelBaud: 9600
}
