(function() {
  "use strict";

  Neo.Classes.Index = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      return {
        name: "ComponentList"
      };
    }
  });
}());