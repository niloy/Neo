(function() {
  "use strict";

  Neo.Classes.HelloWorld = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      return {
        name: "Label",
        text: "Hello World"
      };
    }
  });
}());