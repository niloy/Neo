(function() {
  "use strict";

  Neo.Classes.{ComponentName} = Neo.Classes.{ParentClass}.extend({
    init: function(config) {
      Neo.Classes.{ParentClass}.call(this, config);
    },

    buildDOM: function() {
      // Build the dom
    }
  });
}());