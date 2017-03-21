var now = new Date();

module.exports = {
	useUSB: true,
	time: now.toISOString(),
	logFilename: ('log-' + now.toISOString() + '.csv').replace(/:/g, '.')
}
