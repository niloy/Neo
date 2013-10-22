(function() {
  "use strict";

  Neo.Classes.AnimatedCheckboxTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "AnimatedCheckbox",
        label: "A Checkbox",
        checked: true
      };
    },

    tests: function(AnimatedCheckbox) {
      describe("AnimatedCheckbox", function() {
        // Write test cases here
      });
    }
  });
}());