var http = require('http');
var server = require('./server/server.js');

const port = 80;
const hostname = "10.0.1.4";

http.createServer(function(request, response) {
    console.log("\n----------------");
    console.log("Incoming request");

    // First try to see if this is an action request.
    server.inventory.handleRequest(request, response, function(result) {
        if(result.isAction) {
            // Action responses are sent here.
            response.statusCode = result.status;
            response.end(result.response);
        } 
        
        // If not an action request, we'll interpret it as a file request.
        else {
            // File responses are sent in handleRequest() because of async file reading.
            server.fileServer.handleRequest(request, response);
        }
    });
}).listen(port, hostname, null, function(){
    if(hostname == null) {
        console.log("Inventory running on http://localhost:" + port);
    } else {
        console.log("Inventory running on http://" + hostname + ":" + port);
    }
});