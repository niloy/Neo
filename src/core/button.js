(function() {
  "use strict";

  Neo.Classes.Button = Neo.Classes.UIComponent.extend({
    NO_TEXT: "No text",

    init: function(config) {
      this._text = Neo.ifNull(config.text, this.NO_TEXT);
      this._type = Neo.ifNull(config.type, "button", "string");
      this.button = null;
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("input");

      dom.type = this._type;
      dom.value = this._text;
      this.button = dom;

      return dom;
    },

    get text() {
      return this._text;
    },

    set text(value) {
      Neo.typeCheck(value, "string,number");
      this._text = value;
      this.dom.firstChild.value = value;
    },

    set disabled(value) {
      var s = Object.getOwnPropertyDescriptor(
        Neo.Classes.UIComponent.prototype, "disabled").set;

      s.call(this, value);
      this.button.disabled = value;
    }
  });
}());