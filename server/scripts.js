/*
	Sets up routes from /scripts/... to the actual JavaScript files in node_modules.
*/
path = require('path');

/* Put the path to the scripts here. Express will look in './node_modules/...' for the script */

scripts = [
	"three/build/three.js",
];

module.exports = {
	init: function(app) {
		
		// Loop through all scripts specified in the array above
		for(var i = 0; i < scripts.length; i++) {
			
			// Break the path into parts, and add the current working directory and 'node_modules'
			var pathParts = [__dirname, 'node_modules'].concat(scripts[i].split('/'));
			
			// Get the name of the file, which is simply the last component in the path.
			// The route will be set to '/scripts/<filename>', and will serve the contents
			// specified above.
			var filename = pathParts[pathParts.length - 1];
			
			var filePath = path.join.apply(null, pathParts);
			
			console.log("Setting up script routes");
			console.log("  Adding route:");
			console.log("    Endpoint: /scripts/" + filename);
			console.log("    Filename: " + filePath);
			
			app.get('/scripts/' + filename, function(req, res) {
				res.sendFile(filePath);
			});			
		}
		
		console.log();
	}
}