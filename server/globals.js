var now = new Date();

module.exports = {
	useUSB: false,
	time: now.toISOString(),
	logFilename: ('log-' + now.toISOString() + '.csv').replace(/:/g, '.'),
	// The MAC addresses of the sustainer and booster
	sustainerAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x5A,0xD2,0x0B]),
	boosterAddress: Buffer.from([0x00,0x13,0xA2,0x00,0x41,0x25,0xD1,0xF6])
}
