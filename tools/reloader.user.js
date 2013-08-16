"use strict";

var ws = new WebSocket("ws://localhost:9090/", "echo-protocol");

ws.onopen = function() {
  ws.onmessage = function(message) {
    if (message.data === "refresh browser") {
      window.location.reload();
    }
  };   
};

console.log("Auto Reloader loaded");