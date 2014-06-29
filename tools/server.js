"use strict";

var http = require('http');
// https://github.com/cloudhead/node-static
var Static = require('node-static');
var PORT = 8888;

// Setting up the static web server
var staticServer = new Static.Server("src/", {cache: 0});
http.createServer(function(request, response) {
  request.addListener('end', function () {
    staticServer.serve(request, response);
  }).resume();
}).listen(PORT, function() {
  console.log("Static server started on http://localhost:" + PORT);
});
