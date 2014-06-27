(function() {
  "use strict";

  Neo.Classes.Dropdown = Neo.Classes.Input.extend({
    init: function(config) {
      this._options = Neo.ifNull(config.options, {}, "object");
      this.placeholder = Neo.ifNull(config.placeholder, null, "string");
      this.hideSelectedOption = Neo.ifNull(config.hideSelectedOption, false, "boolean");
      this.display = null;
      this.arrow = null;
      this.optionList = null;
      this.placeholderEl = null;
      this.isOptionListVisible = false;
      this._value = null;
      this.isPlaceholderDisplayed = false;
      this.optionsMap = {};
      this.currentHiddenOption = null;

      if ("displayFormatter" in config) {
        this.displayFormatter = config.displayFormatter;
      }

      Neo.Classes.Input.call(this, config);
    },

    buildDOM: function() {
      var self = this;
      this.display = document.createElement("div");
      this.display.className = "display";
      this.dom.appendChild(this.display);

      this.arrow = document.createElement("div");
      this.arrow.className = "zarrow";
      this.dom.appendChild(this.arrow);

      if (this.placeholder !== null) {
        this._showPlaceholder();
      }

      this.optionList = document.createElement("div");
      this.optionList.className = "optionList";
      this.closeOptionList();
      this._adjustOptionListHeight();
      this.dom.appendChild(this.optionList);

      this.attachExternalListener(document.body, "click", function(e) {
        if (Neo.isDescendant(this.dom, e.target)) {
          this.toggleOptionList();
        } else {
          this.closeOptionList();
        }
      }.bind(this));

      this.attachExternalListener(window, "resize", function() {
        this._adjustOptionListHeight();
      }.bind(this));

      this._populateOptions();
    },

    _adjustOptionListHeight: function() {
      this.optionList.style.maxHeight = (innerHeight - 300) + "px";
    },

    _showPlaceholder: function() {
      this.placeholderEl = document.createElement("span");
      this.placeholderEl.className = "placeholder";
      this.placeholderEl.textContent = this.placeholder;
      this.display.appendChild(this.placeholderEl);
      this.isPlaceholderDisplayed = true;
    },

    _populateOptions: function() {
      this._clearOptions();

      for (var i in this._options) {
        var option = document.createElement("div");
        option.className = "option";

        if (typeof this._options[i] === "string") {
          option.textContent = this._options[i];
        } else {
          this._options[i].parentDom = option;
          this.appendComponent(this._options[i]);
        }

        option.addEventListener("click", function(key) {
          this.value = key;
        }.bind(this, i));

        this.optionsMap[i] = option;
        this.optionList.appendChild(option);
      }
    },

    openOptionList: function() {
      this.optionList.style.display = "";
      this.optionList.scrollTop = 0;
      this.isOptionListVisible = true;
    },

    closeOptionList: function() {
      this.optionList.style.display = "none";
      this.isOptionListVisible = false;
    },

    toggleOptionList: function() {
      if (this.isOptionListVisible) {
        this.closeOptionList();
      } else {
        this.openOptionList();
      }
    },

    _clearOptions: function() {
      Neo.emptyNode(this.optionList);
      this.optionsMap = {};
      this.currentHiddenOption = null;
    },

    clearSelected: function(argument) {
      this._value = null;
      this.display.textContent = "";
      if (this.placeholder !== null) {
        this._showPlaceholder();
      }
    },
    clear: function() {
      this._value = null;
      this._clearOptions();
      this.display.textContent = "";

      if (this.placeholder !== null) {
        this._showPlaceholder();
      }
    },

    get value() {
      return this._value;
    },

    set value(value) {
      Neo.typeCheck(value, "string,number");

      if (!(value in this._options)) {
        throw new Error("the value is not present in option list -> " + value);
      }

      if (value !== this._value) {
        this._value = value;
        var label = this._options[value];

        Neo.emptyNode(this.display);
        this.isPlaceholderDisplayed = false;

        var v = this.displayFormatter(label);

        if (typeof v === "object") {
          v.parentDom = this.display;
          this.appendComponent(v);
        } else {
          this.display.textContent = v;
        }

        if (this.hideSelectedOption) {
          if (this.currentHiddenOption !== null) {
            this.showOption(this.currentHiddenOption);
          }

          this.hideOption(value);
          this.currentHiddenOption = value;
        }

        this.trigger("change");
      }

      this.trigger("selected");
    },

    get options() {
      return this._options;
    },

    set options(value) {
      Neo.typeCheck(value, "object");
      this.clear();
      this._options = value;
      this._populateOptions();
    },

    displayFormatter: function(value) {
      return value;
    },

    hideOption: function(key) {
      this.optionsMap[key].style.display = "none";
    },

    showOption: function(key) {
      this.optionsMap[key].style.display = "";
    }
  });
}());