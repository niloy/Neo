(function() {
  "use strict";

  Neo.Classes.Textfield = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.type = Neo.ifNull(config.type, "text");  
    },

    buildDOM: function() {
      var dom = document.createElement("input");

      dom.type = this.type;

      return dom;
    }
  });
}());