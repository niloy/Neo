(function() {
  "use strict";

  Neo.Classes.AjaxLoaderTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "AjaxLoader",
        text: "Getting tweets"
      };
    },

    tests: function(AjaxLoader) {
      describe("AjaxLoader", function() {
        // Write test cases here
      });
    }
  });
}());