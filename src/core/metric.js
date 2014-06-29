"use strict";

var utils = require("./utils.js");

function Metric() {
  this.componentHistogram = {};
  this.creationLog = [];
  this.eventLog = [];
};

Metric.prototype = {
  addComponent: function(component) {
    utils.typeCheck(component, "object");

    if (!(component.name in this.componentHistogram)) {
      this.componentHistogram[component.name] = 0;
    }

    this.componentHistogram[component.name]++;
  },

  addLog: function(args) {
    this.creationLog.push(args);
  },

  reset: function() {
    this.componentHistogram = {};
  },

  print: function() {
    return JSON.stringify(this, null, "  ");
  },

  addEventLog: function(args) {
    this.eventLog.push(args);
  }
};

var m = new Metric();
module.exports = m;
