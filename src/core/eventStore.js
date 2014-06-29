"use strict";

function EventStore(owner) {
  this.owner = owner;
  this.registry = {};
};

EventStore.prototype = {
  publish: function(eventName, args) {
    var returnValues = [];

    if (eventName in this.registry) {
      this.registry[eventName].forEach(function(e) {
        var r = e.callback.apply(e.context, args);

        if (r !== undefined) {
          // Only JSON stringifyable return values are allowed
          JSON.stringify(r);
          returnValues.push(r);
        }
      }.bind(this));
    }

    return returnValues;
  },

  subscribe: function(event, callback, context) {
    var self = this;

    if (!(event in this.registry)) {
      this.registry[event] = [];
    }

    this.registry[event].push({callback: callback, context: context});
  }
};

module.exports = EventStore;
