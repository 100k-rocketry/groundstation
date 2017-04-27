var exampleSocket = new WebSocket("ws://" + window.location.host);

exampleSocket.onmessage = function(event) {
	// Use JSON.parse(event.data) to turn back into an object
	console.log(event.data);
	packet = JSON.parse(event.data);

	/*document.getElementById("telemetry").innerHTML +=
			"<b>Altimeter:</b> " + packet.altimeter + "<br>" +
			"<b>Latitude:</b> " + packet.latitude + "<br>" +
			"<b>Timestamp:</b>" + packet.timestamp + "<br><br>";

		}*/
		document.getElementById("telemetryrocket").innerHTML+= '<tr><td>' +packet.altitude +' </td><td>'
		 +packet.latitude +' </td><td>' +packet.longitude +'</td><td>'
		 +packet.accelerometer_x +'</td><td>'+packet.accelerometer_y +'</td><td>'
		 +packet.accelerometer_z +'</td><td>'+packet.yaw +'</td><td>'
		 +packet.pitch +'</td><td>'+packet.roll +'</td><td>'
		 +packet.timestamp +'</td></tr>';

}
