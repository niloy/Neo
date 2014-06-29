(function() {
  "use strict";

  Neo.Classes.Input = Neo.Classes.UIComponent.extend({
    ERROR_TEXT: "This input field is not valid",
    REQUIRED_TEXT: "Required field",

    init: function(config) {
      this.validations = Neo.ifNull(config.validations, [], "array");
      this.required = Neo.ifNull(config.required, false, "boolean");
      this._readonly = Neo.ifNull(config.readonly, false, "boolean");
      this._disabled = Neo.ifNull(config.disabled, false, "boolean");
      this._errorText = Neo.ifNull(config.errorText, this.ERROR_TEXT, "string");
      this._fieldname = Neo.ifNull(config.fieldname, null, "string");
      this._errorTextToDisplay = null;

      Neo.Classes.UIComponent.call(this, config);
    },

    get value() {
      throw new Error("please implement 'value' getter");
    },

    set value(value) {
      throw new Error("please implement 'value' setter");
    },

    get fieldname() {
      return this._fieldname;
    },

    set fieldname(value) {
      Neo.typeCheck(value, "string");
      this._fieldname = value;
    },

    get valid() {
      var checkValue = function() {
        if (this.validations.length === 0) {
          return true;
        } else {
          for (var i = 0; i < this.validations.length; i++) {
            var r = this.validations[i](this.value);

            if (r && r.success === false) {
              this._errorTextToDisplay = r.message;
              return false;
            }
          }

          return true;
        }
      }.bind(this);

      if (this.hidden || this.disabled) {
        return true;
      }

      if (this.required && this.isEmpty()) {
        this._errorTextToDisplay = this.REQUIRED_TEXT;
        return false;
      } else if (!this.required && this.isEmpty()) {
        return true;
      } else {
        return checkValue();
      }
    },

    get errorText() {
      return this._errorText;
    },

    set errorText(value) {
      Neo.typeCheck(value, "string");

      this._errorText = value;
    },

    validate: function() {
      if (!this.valid) {
        this.notification = this._errorTextToDisplay;
      }
    },

    isEmpty: function() {
      return this.value.length === 0;
    },

    removeErrorMarker: function() {
      this.notification = null;
    },

    getKeyValuePairs: function() {
      return [{
        key: this.fieldname,
        value: this.value
      }];
    }
  });
}());