(function() {
  "use strict";

  Neo.Classes.Tooltip = Neo.Classes.UIComponent.extend({
    HIDE_TIMEOUT: 250,
    HOVER_TIMEOUT: 250,
    ORIENT_TOP: "top",
    ORIENT_BOTTOM: "bottom",
    ORIENT_LEFT: "left",
    ORIENT_RIGHT: "right",

    init: function(config) {
      var e = new Error("'component' missing from tooltip");
      this.component = Neo.ifNull(config.component || config.text, e, "object,string");
      this.autoShowHide = Neo.ifNull(config.autoShowHide, true, "boolean");
      this.hideTimer = null;
      this.hoverTimer = null;
      config.parentDom = config.parent.dom;
      config.visible = false;

      Neo.Classes.UIComponent.call(this, config);

      if (this.autoShowHide) {
        this.parent.dom.addEventListener("mouseover", function() {
          clearTimeout(this.hideTimer);
          this.hoverTimer = setTimeout(this.show.bind(this), this.HOVER_TIMEOUT);
        }.bind(this));

        this.parent.dom.addEventListener("mouseout", function() {
          clearTimeout(this.hoverTimer);
          this.hideTimer = setTimeout(this.hide.bind(this), this.HIDE_TIMEOUT);
        }.bind(this));
      }
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

        if (compRect.right > tooltipRect.width) {
          this.addClass(this.ORIENT_LEFT);
        } else {
          this.addClass(this.ORIENT_RIGHT);
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