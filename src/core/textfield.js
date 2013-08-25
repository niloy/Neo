(function() {
  "use strict";

  Neo.Classes.Textfield = Neo.Classes.Input.extend({
    init: function(config) {
      this.input = null;
      this.type = Neo.ifNull(config.type, "text");
      this.initialValue = Neo.ifNull(config.value, "", "string,number");
      this.autofocus = Neo.ifNull(config.autofocus, false, "boolean");
      this.multiline = Neo.ifNull(config.multiline, false, "boolean");
      this._placeholder = Neo.ifNull(config.placeholder, null, "string,number");

      Neo.Classes.Input.call(this, config);
    },

    buildDOM: function() {
      if (this.multiline) {
        this.input = document.createElement("textarea");
      } else {
        this.input = document.createElement("input");
      }

      this.input.type = this.type;
      this.input.value = this.initialValue;

      if (this.autofocus) {
        this.input.autofocus = "autofocus";
      }

      if (this._placeholder) {
        this.placeholder = this._placeholder;
      }

      this.input.addEventListener("blur", function() {
        this.validate();
      }.bind(this));

      this.input.addEventListener("focus", function() {
        this.removeNotification();
      }.bind(this));

      return this.input;
    },

    get value() {
      return this.input.value;
    },

    set value(text) {
      Neo.typeCheck(text, "string,number");
      this.input.value = text;
    },

    clear: function() {
      this.input.value = "";
    },

    get fieldname() {
      return this.input.name;
    },
    
    set fieldname(value) {
      Neo.typeCheck(value, "string");
      
      this.input.name = value;
    },

    get placeholder() {
      return this.input.placeholder;
    },
    
    set placeholder(value) {
      Neo.typeCheck(value, "string,number");
      this.input.placeholder = value;
    }
  });
}());