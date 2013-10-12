(function() {
  "use strict";

  Neo.Classes.TabTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Tab",
        tabs: {
          first: {
            title: "First",
            component: {
              name: "Label",
              text: "The First Tab"
            }
          },
          second: {
            active: true,
            component: {
              name: "Button",
              text: "A button in the second tab"
            }
          },
          third: {
            title: "Third",
            component: {
              name: "Label",
              text: "Third tab"
            }
          }
        }
      };
    },

    tests: function(tab) {
      describe("Tab", function() {

      });
    }
  });
}());