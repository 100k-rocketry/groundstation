var EventEmitter = require("events").EventEmitter;
 
var sensorEmitter = new EventEmitter();

// This gets triggered when a new packet comes in.
/*
sensorEmitter.on("newPacket", function () {
    console.log("event has occured");
});
*/

// Fire a fake packet every second
setInterval(function() {
	sensorEmitter.emit("newPacket", {"sensor": "altimeter", "value": 800, "timestamp": "3645345343"});
}, 1000);

module.exports = sensorEmitter;