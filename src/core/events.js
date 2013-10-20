(function() {
  "use strict";

  Neo.Classes.Events = function(owner) {
    this.owner = owner;
    this.registry = {};
  };

  Neo.Classes.Events.prototype = {
    publish: function(eventName, args) {
      if (eventName in this.registry) {
        this.registry[eventName].forEach(function(eObj) {
          eObj.raise(eventName, args);
        }.bind(this));
      }
    },

    subscribe: function(event, callback, context) {
      var self = this;

      var eventProcess = new Neo.Classes.EventProcessor({
        eventString: event,
        eventHandler: callback,
        context: context,
        deleteCallback: function() {
          eventProcess.eventNames.forEach(function(event) {
            var index = self.registry[event].indexOf(eventProcess);
            delete self.registry[event][index];
          });
        }
      });

      eventProcess.eventNames.forEach(function(event) {
        if (!(event in self.registry)) {
          self.registry[event] = [];
        }

        self.registry[event].push(eventProcess);
      });
    }
  };
}());