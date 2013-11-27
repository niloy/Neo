(function() {
  "use strict";

  Neo.Classes.Dropdown = Neo.Classes.Input.extend({
    init: function(config) {
      this.items = Neo.ifNull(config.items, {}, "object");
      this.placeholder = Neo.ifNull(config.placeholder, null, "string");
      this.display = null;
      this.arrow = null;
      this.optionList = null;
      this.placeholderEl = null;
      this.isOptionListVisible = false;
      this._value = null;
      this.isPlaceholderDisplayed = false;

      Neo.Classes.Input.call(this, config);
    },

    buildDOM: function() {
      this.display = document.createElement("div");
      this.display.className = "display";
      this.dom.appendChild(this.display);

      this.arrow = document.createElement("div");
      this.arrow.className = "arrow";
      this.dom.appendChild(this.arrow);
      this.dom.addEventListener("click", function(e) {
        e.stopPropagation();
        this.toggleOptionList();
      }.bind(this));

      if (this.placeholder !== null) {
        this.placeholderEl = document.createElement("span");
        this.placeholderEl.className = "placeholder";
        this.placeholderEl.textContent = this.placeholder;
        this.display.appendChild(this.placeholderEl);
        this.isPlaceholderDisplayed = true;
      }

      this.optionList = document.createElement("div");
      this.optionList.className = "optionList";
      this.closeOptionList();
      this.optionList.style.maxHeight = (innerHeight - 125) + "px";
      this.dom.appendChild(this.optionList);

      this.attachExternalListener(document.body, "click", function() {
        this.closeOptionList();
      }.bind(this));

      this.attachExternalListener(window, "resize", function() {
        this.optionList.style.maxHeight = (innerHeight - 125) + "px";
      }.bind(this));

      this._populateOptions();
    },

    _populateOptions: function() {
      for (var i in this.items) {
        var option = document.createElement("div");
        option.className = "option";
        option.textContent = this.items[i];
        option.addEventListener("click", function(key) {
          this.value = key;
        }.bind(this, i));
        this.optionList.appendChild(option);
      }
    },

    openOptionList: function() {
      this.optionList.style.display = null;
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

    get value() {
      return this._value;
    },

    set value(value) {
      Neo.typeCheck(value, "string,number");

      if (!(value in this.items)) {
        throw new Error("the value is not present in option list -> " + value);
      }

      if (value !== this._value) {
        this._value = value;
        var label = this.items[value];

        if (this.isPlaceholderDisplayed) {
          this.display.removeChild(this.placeholderEl);
          this.isPlaceholderDisplayed = false;
        }

        this.display.textContent = label;
        this.trigger("change");
      }

      this.trigger("selected");
    }
  });
}());