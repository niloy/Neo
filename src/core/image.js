(function() {
  "use strict";

  Neo.Classes.Image = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this.src = Neo.ifNull(config.src, "../assets/emptyImage.png");
      this.alt = Neo.ifNull(config.alt, null);
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var dom = document.createElement("image");

      dom.src = this.src;

      if (this.alt !== null) {
        dom.alt = this.alt;
      }

      return dom;
    },

    setSrc: function(src) {
      Neo.typeCheck(src, "string");

      this.src = src;
      this.dom.src = src;
    },

    getSrc: function(src) {
      return this.src;
    },

    setAlt: function(alt) {
      Neo.typeCheck(alt, "string");

      this.alt = alt;
      this.dom.alt = alt;
    },

    getAlt: function() {
      return this.alt;
    }
  });
}());