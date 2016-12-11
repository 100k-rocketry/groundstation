var express = require('express');
var path = require('path');

var app = express();
var port = process.env.GROUNDSTATION_PORT || 8080

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res) {
	res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Listen on the specified port.
app.listen(port, function () {
	console.log("Listening on port", port);
});