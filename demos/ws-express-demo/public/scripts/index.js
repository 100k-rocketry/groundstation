var exampleSocket = new WebSocket("ws://localhost:8080/");

exampleSocket.onmessage = function(event) {
	console.log(event.data);
}