(function() {
  "use strict";

  Neo.Classes.ProgressbarTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Progressbar",
        value: 50
      };
    },

    tests: function(Progressbar) {
      describe("Progressbar", function() {
        // Write test cases here
      });
    }
  });
}());