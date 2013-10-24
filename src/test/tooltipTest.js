(function() {
  "use strict";

  Neo.Classes.TooltipTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Button",
        text: "Hover Me",
        tooltip: "Lorem Ipsum is simply dummy text of the printing and typesetting \
industry. Lorem Ipsum has been the industry's standard dummy text ever since the \
1500s, when an unknown printer took a galley of type and scrambled it to make a \
type specimen book."
      };
    },

    tests: function(tooltip) {
      describe("Tooltip", function() {
        // Write test cases here
      });
    }
  });
}());