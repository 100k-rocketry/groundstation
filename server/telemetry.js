var EventEmitter = require("events").EventEmitter;
 
var telemetryEmitter = new EventEmitter();

// This gets triggered when a new packet comes in.
/*
sensorEmitter.on("newPacket", function () {
    console.log("event has occured");
});
*/

telemetryEmitter.altitude = 0;
telemetryEmitter.timestamp = 0;

// Sends a fake packet
telemetryEmitter.sendPacket = function() {
	//console.log(this);
	this.emit("newPacket", {"sensor": "altimeter", "value": this.altitude, "timestamp": this.timestamp});
	this.emit("newPacket", {"sensor": "barometer", "value": 353, "timestamp": this.timestamp});
	this.altitude += 10;
	this.timestamp += 1;
};

// Fire a fake packet every second
setInterval(() => { telemetryEmitter.sendPacket(); }, 1000);

module.exports = telemetryEmitter;