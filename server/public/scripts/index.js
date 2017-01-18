var exampleSocket = new WebSocket("ws://localhost:8080/");

exampleSocket.onmessage = function(event) {
	// Use JSON.parse(event.data) to turn back into an object
	console.log(event.data);
}