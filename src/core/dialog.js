(function() {
  "use strict";

  var DIALOG_OPENED = "neoDialogOpened";

  Neo.Classes.Dialog = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this._body = Neo.ifNull(config.body, new Error("'body' missing"), "object");
      this._bodyDom = null;
      this._closeOnClickMask = Neo.ifNull(config.closeOnClickMask,false,"boolean");
      this._mask = null;
      this.beforeClose = Neo.ifNull(config.beforeClose, function() {}, "function");
      this.afterClose = Neo.ifNull(config.afterClose, function() {}, "function");
      this._opened = false;

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      this.dom.tabIndex = "-1";
      this.dom.style.opacity = 0;

      this.dom.addEventListener("click", function(e) {
        if (e.target === this.dom && this._closeOnClickMask) {
          this._closeButtonClicked();
        }
      }.bind(this));

      var bodyContainer = document.createElement("div");
      bodyContainer.className = "dialogBodyContainer";
      this.dom.appendChild(bodyContainer);
      this._body.parentDom = bodyContainer;
      this.appendComponent(this._body);

      this.visible = false;
      this.addClass("closed");
      this.dom.style.opacity = null;
    },

    open: function() {
      if (!this._opened) {
        this.visible = true;
        document.querySelector("html").classList.add(DIALOG_OPENED);
        this.removeClass("closed");
        this.addClass("opened");
        this.dom.scrollTop = 0;
        this.dom.focus();
        this._opened = true;
      }
    },

    close: function() {
      if (this._opened) {
        document.querySelector("html").classList.remove(DIALOG_OPENED);
        this.removeClass("opened");
        this.addClass("closed");
        this.visible = false;
        this._opened = false;
        this.afterClose();
      }
    },

    _closeButtonClicked: function() {
      if (this.beforeClose() !== false) {
        this.close();
      }
    }
  });
}());
