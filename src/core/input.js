(function() {
  "use strict";

  Neo.Classes.Input = Neo.Classes.UIComponent.extend({
    ERROR_TEXT: "This input field is not valid",
    REQUIRED_TEXT: "This is a required field",

    init: function(config) {
      this.validation = Neo.ifNull(config.validation, null, "regex,function");
      this.required = Neo.ifNull(config.required, false, "boolean");
      this.readonly = Neo.ifNull(config.readonly, false, "boolean");
      this._disabled = Neo.ifNull(config.disabled, false, "boolean");
      this._errorText = Neo.ifNull(config.errorText, this.ERROR_TEXT, "string");
      this._fieldname = Neo.ifNull(config.fieldname, null, "string");
      this._errorTextToDisplay = null;

      Neo.Classes.UIComponent.call(this, config);

      if (this._fieldname !== null) {
        this.fieldname = this._fieldname;
      }
    },

    get value() {
      throw new Error("please implement 'value' getter");
    },

    set value() {
      throw new Error("please implement 'value' setter");
    },

    get fieldname() {
      throw new Error("please implement 'fieldname' getter");
    },

    set fieldname(value) {
      throw new Error("please implement 'fieldname' setter");
    },

    get valid() {
      var checkValue = function() {
        this._errorTextToDisplay = this.errorText;

        if (typeof this.validation === "function") {
          var returnValue = this.validation(this.value);

          if (typeof returnValue !== "boolean") {
            throw new Error("expecting boolean return value from validation function");
          }

          return returnValue;
        } else {
          return this.validation.test(this.value);
        }
      }.bind(this);

      if (this.hidden || this.disabled) {
        return true;
      }

      if (this.required) {
        if (this.value.length === 0) {
          this._errorTextToDisplay = this.REQUIRED_TEXT;
          return false;
        }

        return checkValue();
      } else {
        if (this.value.length === 0) {
          return true;
        } else {
          return checkValue();
        }
      }
    },

    set valid() {
      throw new Error("setter is not avaliable");
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
    }
  });
}());