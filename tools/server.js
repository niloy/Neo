"use strict";

var http = require('http');
// https://github.com/cloudhead/node-static
var Static = require('node-static');
var PORT = 80;

// Setting up the static web server
var staticServer = new Static.Server("src/", {cache: 0});
http.createServer(function(request, response) {
  request.addListener('end', function () {
    staticServer.serve(request, response);
  }).resume();
}).listen(PORT, function() {
  console.log("Static server started on http://localhost");
});

////////////////////////////////////////////////////////////////////////////////
// The code below is required for automatic browser reload functionality.
// Combined with the chrome extension 'reloader.user.js', the browser will
// be refreshed whenever a file is updated in the 'src/' directory.
////////////////////////////////////////////////////////////////////////////////

// https://github.com/Worlize/WebSocket-Node
var WebSocketServer = require('websocket').server;
// https://github.com/paulmillr/chokidar
var chokidar = require('chokidar');
var WSPORT = 9090;

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(WSPORT, function() {
  console.log("Websocket Server started on http://localhost:" + WSPORT);
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

var wsConnection;

wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);
  
  wsConnection = connection;
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
});

var watcher = chokidar.watch("src/");

watcher.on("change", function(path) {
   wsConnection.sendUTF("refresh browser"); 
});