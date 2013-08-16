(function() {
  "use strict";

  Neo.Classes.Label = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.text = Neo.ifNull(config.text, "NO TEXT", "string");
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("label");

      dom.innerText = this.text;

      return dom;
    },
    
    setText: function(text) {
      this.text = text;
      this.dom.childNodes[0].innerText = this.text;
    },

    getText: function() {
      return this.text;
    }
  });
}());