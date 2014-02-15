(function() {
  "use strict";

  Neo.Classes.EventStore = function(owner) {
    this.owner = owner;
    this.registry = {};
  };

  Neo.Classes.EventStore.prototype = {
    publish: function(eventName, args) {
      if (eventName in this.registry) {
        this.registry[eventName].forEach(function(e) {
          e.callback.apply(e.context, args);
        }.bind(this));
      }
    },

    subscribe: function(event, callback, context) {
      var self = this;

      if (!(event in this.registry)) {
        this.registry[event] = [];
      }

      this.registry[event].push({callback: callback, context: context});
    }
  };
}());