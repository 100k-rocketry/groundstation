var exampleSocket = new WebSocket("ws://localhost:8080/");

exampleSocket.onmessage = function(event) {
	// Use JSON.parse(event.data) to turn back into an object
	console.log(event.data);
	packet = JSON.parse(event.data);
	document.getElementById("telemetry").innerHTML += 
			"<b>Sensor:</b> " + packet.sensor + "<br>" +
			"<b>Value:</b> " + packet.value + "<br>" +
			"<b>Timestamp:</b>" + packet.timestamp + "<br><br>";
}