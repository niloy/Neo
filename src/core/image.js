(function() {
  "use strict";

  Neo.Classes.Image = Neo.Classes.UIComponent.extend({
    EMPTY_IMAGE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC\
1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=",

    init: function(config) {
      this.img = null;
      this._src = Neo.ifNull(config.src, this.EMPTY_IMAGE);
      this._alt = Neo.ifNull(config.alt, null, "string,number");

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      this.img = document.createElement("img");

      this.img.src = this._src;

      if (this._alt !== null) {
        this.alt = this._alt;
      }

      return this.img;
    },

    get src() {
      return this.img.src;
    },

    set src(value) {
      this.img.src = value;
    },

    get alt() {
      return this.img.alt;
    },

    set alt(value) {
      Neo.typeCheck(value, "string,number");
      this.img.alt = value;
    }
  });
}());