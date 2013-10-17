(function() {
  "use strict";

  Neo.Classes.Metric = function() {
    this.componentHistogram = {};
    this.creationLog = [];
  };

  Neo.Classes.Metric.prototype = {
    addComponent: function(component) {
      Neo.typeCheck(component, "object");

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
    }
  };

  Neo.Metrics = new Neo.Classes.Metric();
}());