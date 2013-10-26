(function() {
  "use strict";

  Neo.Classes.ProgressbarTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Progressbar",
        minValue: 200,
        value: 250,
        maxValue: 300
      };
    },

    tests: function(Progressbar) {
      describe("Progressbar", function() {
        // Write test cases here
      });
    }
  });
}());