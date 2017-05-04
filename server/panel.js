var fs = require('fs');
var spawn = require('child_process');
var globals = require('./globals');

var panelFd = -1;

function tryOpenPanelDevice() {
	try {
		spawn.spawnSync('/dev/stty', ['-F', globals.panelDeviceName, globals.panelBaud, 'raw']);
		fs.open(globals.panelDeviceName, 'r+', function(err, fd) {
			panelFd = fd;			
		});
	} catch (err) {
		console.log("Cannot open panel device " + globals.panelDeviceName);
		setTimeout(tryOpenPanelDevice, 1000);
	}
}

tryOpenPanelDevice();


function writeHandler(err, written, buffer) {
	if (err) {
		console.log(err);
	}
}

module.exports = {
	// Sets the appropriate light to the appropriate state.
	// lightName: scomm, signition, serror, bcomm, bignition, berror, alarm
	// state: on, off
	setLight: function (lightName, state) {
		if (panelFd != -1) {
			try {
				var lightString = lightName + ' ' + state + '\n';
				fs.write(panelFd, lightString, writeHandler);
			} catch (err) {
				console.log(err);
				panelFd = -1;
				tryOpenPanelDevice();
			}
		}
	},

	// Sets the text of the line number
	// line number: 1 - 4
	// msg: no longer than 20 characters (or it will wrap to the next line).
	// Automatically pads msg to fill up the line so old characters are erased
	setLine: function (lineNumber, msg) {
		try {
			msg = ('' + msg).substring(0, 20);
			var stringToSend = 'line' + lineNumber + '="' + msg + ' '.repeat(20 - msg.length) + '\n';
			fs.write(panelFd, stringToSend, writeHandler);
		} catch(err) {
			console.log(err);
			panelFd = -1;
			tryOpenPanelDevice();	
		}
	}
}
