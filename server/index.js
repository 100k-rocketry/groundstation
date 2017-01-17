// Scripts installed by node_modules
var express = require('express');
var path = require('path');


var app = require('./app');

var sensor = require('./sensor');
//sensor.sendPacket();

sensor.on("newPacket", function(packet) {
	console.log(packet);
});