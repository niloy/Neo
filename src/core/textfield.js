(function() {
  "use strict";

  Neo.Classes.Textfield = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.type = Neo.ifNull(config.type, "text");  
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("input");

      dom.type = this.type;

      return dom;
    }
  });
}());