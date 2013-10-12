(function() {
  "use strict";

  Neo.Classes.{ComponentName}Test = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "{ComponentName}"
      };
    },

    tests: function({ComponentName}) {
      describe("{ComponentName}", function() {
        // Write test cases here
      });
    }
  });
}());