(function() {
  "use strict";

  Neo.Classes.AjaxLoader = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.loaderEl = null;
      this._text = Neo.ifNull(config.text, "", "string");
      this.textEl = null;

      Neo.Classes.UIComponent.call(this, config);

      this.text = this._text;
    },

    buildDOM: function() {
      this.textEl = document.createElement("div");
      this.textEl.className = "text";
      this.dom.appendChild(this.textEl);

      var loader = document.createElement("div");
      loader.className = "loader";
      this.dom.appendChild(loader);

      var waitText = document.createElement("div");
      waitText.textContent = "Please wait...";
      this.dom.appendChild(waitText);
    },

    get text() {
      return this._text;
    },

    set text(value) {
      Neo.typeCheck(value, "string");
      this._text = value;
      this.textEl.textContent = value;
    }
  });
}());