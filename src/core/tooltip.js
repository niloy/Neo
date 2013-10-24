(function() {
  "use strict";

  Neo.Classes.Tooltip = Neo.Classes.UIComponent.extend({
    HIDE_TIMEOUT: 250,
    ORIENT_TOP: "orientTop",
    ORIENT_BOTTOM: "orientBottom",

    init: function(config) {
      var e = new Error("'component' missing from tooltip");
      this.component = Neo.ifNull(config.component || config.text, e, "object,string");
      this.hideTimer = null;
      config.parentDom = config.parent.dom;
      config.visible = false;

      Neo.Classes.UIComponent.call(this, config);

      this.parent.dom.addEventListener("mouseover", function() {
        clearInterval(this.hideTimer);
        this.show();
      }.bind(this));

      this.parent.dom.addEventListener("mouseout", function() {
        this.hideTimer = setTimeout(function() {
          this.hide();
        }.bind(this), this.HIDE_TIMEOUT);
      }.bind(this));
    },

    buildDOM: function() {
      var component;

      var arrow = document.createElement("div");
      arrow.className = "tooltipArrow";
      this.dom.appendChild(arrow);

      if (typeof this.component === "string") {
        component = {
          name: "Label",
          text: this.component
        };
      } else {
        component = this.component;
      }

      component.parent = this;
      component.parentDom = this.dom;
      Neo.createComponent(component);
    },

    show: function() {
      if (!this.visible) {
        this.visible = true;
        var tooltipRect = this.dom.getBoundingClientRect();
        var compRect = this.parent.dom.getBoundingClientRect();
        var y = "-" + (tooltipRect.height + 10) + "px";

        if (compRect.top > tooltipRect.height) {
          this.dom.style.top = y;
          this.addClass(this.ORIENT_TOP);
        } else {
          this.dom.style.bottom = y;
          this.addClass(this.ORIENT_BOTTOM);
        }
      }
    },

    hide: function() {
      if (this.visible) {
        this.visible = false;
        this.removeClass(this.ORIENT_TOP);
        this.removeClass(this.ORIENT_BOTTOM);
      }
    }
  });
}());