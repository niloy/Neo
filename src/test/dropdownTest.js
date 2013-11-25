(function() {
  "use strict";

  Neo.Classes.DropdownTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      var items = {};

      for (var i = 0; i < 255; i++) {
        items[i] = i;
      }

      return {
        name: "Dropdown",
        placeholder: "Select an option",
        items: items,
        listeners: {
          change: function() {
            console.log('dropdown value changed ' + this.value);
          }
        }
      };
    },

    tests: function(Dropdown) {
      describe("Dropdown", function() {
        // Write test cases here
      });
    }
  });
}());