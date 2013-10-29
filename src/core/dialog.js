(function() {
  "use strict";

  Neo.Classes.Dialog = Neo.Classes.UIComponent.extend({
    DEFAULT_TITLE: "Application",
    WIGGLE: "wiggle",

    init: function(config) {
      this._title = Neo.ifNull(config.title, this.DEFAULT_TITLE, "string");
      this._body = Neo.ifNull(config.body, new Error("'body' missing"), "object");
      this._titleDom = null;
      this._bodyDom = null;
      this._mask = null;
      this.beforeClose = Neo.ifNull(config.beforeClose, function() {}, "function");
      this.afterClose = Neo.ifNull(config.afterClose, function() {}, "function");
      this._opened = false;

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
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
      closeButton.addEventListener("click", this._closeButtonClicked.bind(this));
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
      this.addClass("closed");
      this.dom.style.opacity = null;

      this.dom.addEventListener("webkitAnimationEnd", function(e) {
        if (e.target === this.dom) {
          this.removeClass(this.WIGGLE);
        }
      }.bind(this));
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
      if (!this._opened) {
        this.visible = true;
        this._createMask();

        this.dom.getBoundingClientRect();
        this._mask.style.opacity = 0.7;
        this.removeClass("closed");
        this.addClass("opened");
        this._opened = true;
      }
    },

    close: function() {
      if (this._opened) {
        this.removeClass("opened");
        this.addClass("closed");
        this._mask.style.opacity = 0;

        var transitionend = function(e) {
          if (e.target === this.dom) {
            this.visible = false;
            this._opened = false;
            this._removeMask();
            this.dom.removeEventListener("transitionend", transitionend);
            this.afterClose();
          }
        }.bind(this);

        this.dom.addEventListener("transitionend", transitionend);
      }
    },

    _createMask: function() {
      var mask = document.createElement("div");
      mask.className = "dialogMask";
      mask.addEventListener("click", this._maskClicked.bind(this));
      this.parentDom.appendChild(mask);
      this._mask = mask;
    },

    _removeMask: function() {
      this.parentDom.removeChild(this._mask);
    },

    _closeButtonClicked: function() {
      if (this.beforeClose() !== false) {
        this.close();
      }
    },

    _maskClicked: function(e) {
      e.stopPropagation();

      if (!this.hasClass(this.WIGGLE)) {
        this.addClass(this.WIGGLE);
      }
    }
  });
}());
