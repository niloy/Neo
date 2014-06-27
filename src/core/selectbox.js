(function() {
  "use strict";

  Neo.registerClass("Selectbox", "Input", {
    init: function(config) {
      this.select = null;

      Neo.Classes.Input.call(this, config);

      var options = Neo.ifNull(config.options, {}, "array");
      this.options = options;
    },

    buildDOM: function() {
      this.select = document.createElement("select");
      return this.select;
    },

    get options() {
      return this._options;
    },

    set options(opts) {
      Neo.typeCheck(opts, "array");

      this.clear();

      opts.forEach(function(o) {
        var option = document.createElement("option");
        option.value = o.value;
        option.textContent = o.text;

        if (o.selected === true) {
          option.selected = true;
        }

        this.select.appendChild(option);
      }.bind(this));
    },

    clear: function() {
      Neo.emptyNode(this.select);
    },

    get value() {
      return this.select.value;
    },

    set value(value) {
      Neo.typeCheck(value, "string,number");
      this.select.value = value;
    }
  });
}());