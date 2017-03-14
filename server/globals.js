var now = new Date();

module.exports = {
	useUSB: false,
	time: now.toISOString(),
	logFilename: ('log-' + now.toISOString() + '.csv').replace(/:/g, '.')
}