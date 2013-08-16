(function() {
  "use strict";

  Neo.Classes.Button = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.text = Neo.ifNull(config.text, "No text");
    },

    buildDOM: function() {
      var dom = document.createElement("button");

      dom.innerText = this.text;

      return dom;
    },

    getText: function() {
      return this.text;
    },

    setText: function(text) {
      Neo.typeCheck(text, "string");

      this.text = text;
      this.dom.childNodes[0].innerText = this.text;
    }
  });
}());