(function() {
  "use strict";

  Neo.Classes.Progressbar = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this._minValue = Neo.ifNull(config.minValue, 0, "number");
      this._maxValue = Neo.ifNull(config.maxValue, 100, "number");
      this._value = Neo.ifNull(config.value, null, "number");
      this.progressEl = null;
      this.textContainer = null;

      this._validateValues(this._minValue, this._value, this._maxValue);

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var container = document.createElement("div");
      container.className = "container";

      var progressEl = document.createElement("div");
      progressEl.className = "progressElement";
      progressEl.style.width = "0%";
      container.appendChild(progressEl);
      this.progressEl = progressEl;

      var textContainer = document.createElement("div");
      textContainer.className = "textContainer";
      textContainer.textContent = "0%";
      this.textContainer = textContainer;
      container.appendChild(textContainer);

      this._renderProgressBar();

      return container;
    },

    get value() {
      return this._value;
    },

    set value(value) {
      Neo.typeCheck(value, "number");
      this._validateValues(this._minValue, value, this._maxValue);
      this._value = value;
      this._renderProgressBar();
    },

    _renderProgressBar: function() {
      var value = this._value - this._minValue;
      var max = this._maxValue - this._minValue;
      var percent = Math.round(value / max * 100);

      this.progressEl.style.width = percent + "%";
      this.textContainer.textContent = percent + "%";
    },

    get minValue() {
      return this._minValue;
    },

    set minValue(value) {
      Neo.typeCheck(value, "number");
      this._validateValues(value, this._value, this._maxValue);
      this._minValue = value;
      this._renderProgressBar();
    },

    get maxValue() {
      return this._maxValue;
    },

    set maxValue(value) {
      Neo.typeCheck(value, "number");
      this._validateValues(this._minValue, this._value, value);
      this._maxValue = value;
      this._renderProgressBar();
    },

    _validateValues: function(min, value, max) {
      if ((min > max) || (value < min) || (value > max)) {
        throw new Error("invalid values passed to progress bar");
      }
    }
  });
}());