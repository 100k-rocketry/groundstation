var fs = require('fs');

module.exports = {
    createPersistentReadStream: function (filename, baud, dataCallback) {
    	// If the file doesn't exist, then try again in one second
    	if (!fs.existsSync(filename)) {
    		console.log("Could not open file: " + filename);
    		setTimeout(() => { createPersistentReadStream(filename, baud, dataCallback); }, 1000);
    		return;
    	}

    	// Set the device to raw mode and set the appropriate baud
    	spawn.spawnSync('/bin/stty', ['-F', filename, baud, 'raw']);
    	var stream = fs.createReadStream(filename);

    	// Stream opened successfully.
    	stream.on('open', () => {
    		console.log("Acquired connection to " + filename);
    		// When we get data, call the data callback.
    		stream.on('data', (d) => {
    			dataCallback(new Buffer(d));
    		});
    	});

    	// The stream didn't open correctly, so try again after a small delay.
    	stream.on('error', (err) => {
    		console.log("Stream error: " + err);
    		setTimeout(() => { createPersistentReadStream(filename, baud, dataCallback); }, 1000);
    	});

    	// File closed? That shouldn't happen, so try to re-open the stream.
    	stream.on('close', () => {
    		console.log("Lost connection to groundstation.");
    		createPersistentReadStream(filename, baud, dataCallback);
    	});
    }
}
