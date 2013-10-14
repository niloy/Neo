(function() {
  "use strict";

  Neo.Classes.AlertTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      Neo.alert({
        text: "This is an example of Alert Box",
        title: "Alert box",
        callback: function() {
          console.log('alert closed');
        }
      });
    },

    tests: function() {
      describe("Alert Test", function() {
        // Write test cases here
      });
    }
  });
}());