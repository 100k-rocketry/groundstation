var exampleSocket = new WebSocket("ws://localhost:8081");

exampleSocket.onmessage = function(event) {
	console.log(event.data);
}