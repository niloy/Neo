"use strict";

var system = require("system");
var page = require('webpage').create();
var OUT_FOLDER = "build/test/";

var viewName = system.args[1];

if (viewName == null) {
  console.log("ERROR: the page to test must be passed as first argument");
  phantom.exit(1);
}

page.viewportSize = {width: 1024, height: 768};

page.open("http://localhost:8888/index.html?v=" + viewName, function(status) {
  if (status !== 'success') {
    console.log("ERROR: unable to open page");
    phantom.exit(1);
  }
});

page.onCallback = function(data) {
  switch (data.msg) {
    case 'PAGE_READY':
      page.render(OUT_FOLDER + viewName + ".png");
      break;
  }

  phantom.exit();
};

page.onError = function(msg) {
  console.log("ERROR: Javascript error -> " + msg);
  phantom.exit();
};

page.onResourceError = function(resourceError) {
  console.log('Unable to load resource URL:' + resourceError.url);
};