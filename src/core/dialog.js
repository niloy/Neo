(function() {
  "use strict";

  Neo.Classes.Dialog = Neo.Classes.UIComponent.extend({
    DEFAULT_TITLE: "Application",

    init: function(config) {
      this._title = Neo.ifNull(config.title, this.DEFAULT_TITLE, "string");
      this._body = Neo.ifNull(config.body, new Error("'body' missing"), "object");
      this._titleDom = null;
      this._bodyDom = null;
      this._mask = null;
      this.onClose = Neo.ifNull(config.onClose, function() {}, "function");
      config.parentDom = document.getElementById("dialogContainer");

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      // var mask = document.createElement("div");
      // mask.className = "dialogMask";
      // mask.addEventListener("click", function() {
      //   console.log('mask clicked');
      // });
      // document.body.appendChild(mask);
      // this._mask = mask;
      this.dom.style.opacity = 0;

      var titleContainer = document.createElement("div");
      titleContainer.className = "dialogTitleContainer";
      this.dom.appendChild(titleContainer);

      var title = document.createElement("div");
      title.className = "dialogTitle";
      title.textContent = this._title;
      this._titleDom = title;
      titleContainer.appendChild(title);

      var closeButton = document.createElement("div");
      closeButton.className = "dialogCloseButton";
      closeButton.textContent = "[X]";
      closeButton.addEventListener("click", function() {
        if (this.onClose() !== false) {
          this.close();
        }
      }.bind(this));
      titleContainer.appendChild(closeButton);

      var bodyContainer = document.createElement("div");
      bodyContainer.className = "dialogBodyContainer";
      this.dom.appendChild(bodyContainer);
      this._body.parent = this;
      this._body.parentDom = bodyContainer;
      Neo.createComponent(this._body);

      var style = window.getComputedStyle(this.dom);
      var marginLeft = Math.floor(parseInt(style.width, 10) / 2) * -1;
      var marginTop = Math.floor(parseInt(style.height, 10) / 2) * -1;
      this.dom.style.marginLeft = marginLeft + "px";
      this.dom.style.marginTop = marginTop + "px";

      this.visible = false;
      this.dom.style.opacity = 1;
    },

    get title() {
      return this._title;
    },

    set title(value) {
      Neo.typeCheck(value, "string");
      this._title = value;
      this._titleDom.textContent = value;
    },

    open: function() {
      this.visible = true;
    },

    close: function() {
      this.visible = false;
    }
  });
}());
