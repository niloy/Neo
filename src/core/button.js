(function() {
  "use strict";

  Neo.Classes.Button = Neo.Classes.UIComponent.extend({
    NO_TEXT: "No text",

    init: function(config) {
      this._text = Neo.ifNull(config.text, this.NO_TEXT);
      this._type = Neo.ifNull(config.type, "button", "string");
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("input");

      dom.type = this._type;
      dom.value = this._text;

      return dom;
    },

    get text() {
      return this._text;
    },

    set text(value) {
      Neo.typeCheck(value, "string,number");
      this._text = value;
      this.dom.childNodes[0].textContent = value;
    }
  });
}());