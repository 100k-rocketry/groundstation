var now = new Date();

module.exports = {
	// Set this to false to use the mocked data instead of trying to connect to the actual telemtry device
	useUSB: false,
	replayFile: 'logs/log-2017-04-27T19.53.51.120Z.csv',
	// The time that the server started up (used for the log filename)
	time: now.toISOString(),
	logFilename: ('log-' + now.toISOString() + '.csv').replace(/:/g, '.'),
	// The MAC addresses of the sustainer and booster
	sustainerAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x5A,0xD2,0x0B]),
	boosterAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x25,0xD1,0xF6]),
	baud: 115200,
	// The device that we are receiving telemetry from
	deviceName: '/dev/ttyUSB0'
}
