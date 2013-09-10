(function() {
  "use strict";

  Neo.Classes.Label = Neo.Classes.UIComponent.extend({
    NO_TEXT: "NO TEXT",

    init: function(config) {
      this._text = Neo.ifNull(config.text, this.NO_TEXT, "string");

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("label");

      dom.textContent = this._text;

      return dom;
    },

    get text() {
      return this._text;
    },

    set text(value) {
      Neo.typeCheck(value, "string,number");

      this._text = value;
      this.dom.childNodes[0].textContent = this._text;
    },

    clear: function() {
      this.text = "";
    }
  });
}());