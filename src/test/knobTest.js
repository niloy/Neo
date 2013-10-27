(function() {
  "use strict";

  Neo.Classes.KnobTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Knob",
        listeners: {
          change: function(e) {
            var value = Math.floor(e.detail.value * 100);
            var testView = document.querySelector(".compKnobTest");
            var pattern = "white,gold";
            var array = [pattern];

            for (var i = 0; i < value; i++) {
              array.push(pattern);
            }

            testView.style.backgroundImage = "radial-gradient(" + array.join() + ")";
          }
        }
      };
    },

    tests: function(Knob) {
      describe("Knob", function() {
        // Write test cases here
      });
    }
  });
}());