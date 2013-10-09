(function() {
  "use strict";

  Neo.Classes.Checkbox = Neo.Classes.Input.extend({
    init: function(config) {
      this.input = null;
      this.labelDOM = null;
      this._checked = Neo.ifNull(config.checked, false, "boolean");
      this._label = Neo.ifNull(config.label, null, "string,number");

      Neo.Classes.Input.call(this, config);
    },

    buildDOM: function() {
      var label = document.createElement("label");

      this.input = document.createElement("input");
      this.input.type = "checkbox";
      this.input.className = "checkbox";
      this.input.checked = this._checked;
      label.appendChild(this.input);

      if (this._label !== null) {
        this.labelDOM = document.createElement("span");
        this.labelDOM.className = "label";
        this.labelDOM.textContent = this._label;
        label.appendChild(this.labelDOM);
      }

      return label;
    },

    get value() {
      return this.checked;
    },

    set value(value) {
      this.checked = value;
    },

    get checked() {
      return this.input.checked;
    },

    set checked(value) {
      Neo.typeCheck(value, "boolean");
      this.input.checked = value;
    },

    get fieldname() {
      return this.input.name;
    },

    set fieldname(value) {
      Neo.typeCheck(value, "string,number");
      this.input.name = value;
    }
  });
}());