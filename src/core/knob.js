(function() {
  "use strict";

  // http://dribbble.com/shots/709502-knob-2

  Neo.Classes.Knob = Neo.Classes.UIComponent.extend({
    WHEEL_SENSITIVIY: 0.05,
    MAX_KNOB_ANGLE: 290,

    init: function(config) {
      this._value = 0;
      this.arrowContainer = null;
      this.mousedown = false;

      Neo.Classes.UIComponent.call(this, config);

      this._renderArrow();
    },

    buildDOM: function() {
      var container = document.createElement("div");
      container.className = "container";

      var arrowContainer = document.createElement("div");
      arrowContainer.className = "arrowContainer";
      container.appendChild(arrowContainer);
      this.arrowContainer = arrowContainer;

      var arrow = document.createElement("div");
      arrow.className = "arrow";
      arrowContainer.appendChild(arrow);

      var inputContainer = document.createElement("div");
      inputContainer.className = "inputContainer";
      inputContainer.addEventListener("mousedown", function(e) {
        this.mousedown = true;
      }.bind(this));
      inputContainer.addEventListener("mouseup", function() {
        this.mousedown = false;
      }.bind(this));
      inputContainer.addEventListener("mousemove", function(e) {
        if (this.mousedown) {
          this._mousemove(e.offsetX, e.offsetY);
        }
      }.bind(this));
      inputContainer.addEventListener("mousewheel", this._mousewheel.bind(this));
      container.appendChild(inputContainer);

      return container;
    },

    _renderArrow: function() {
      var deg = this.value * this.MAX_KNOB_ANGLE;

      this.arrowContainer.style.webkitTransform = "rotate(" + deg + "deg)";
    },

    get value() {
      return this._value;
    },

    set value(value) {
      Neo.typeCheck(value, "number");
      this._value = value;
      this._renderArrow();
      this.trigger("change", {value: value});
    },

    _mousemove: function(mousex, mousey) {
      var WIDTH = 176;
      var HEIGHT = 176;
      var CENTERX = WIDTH / 2;
      var CENTERY = HEIGHT / 2;
      var angle = Math.atan2(mousey - CENTERY, mousex - CENTERX) * 180 / Math.PI;
      var MAX_ANGLE = this.MAX_KNOB_ANGLE - 360;

      this.arrowContainer.style.transition = "none";
      this.arrowContainer.getBoundingClientRect();

      if (angle >= 0 && angle <= 180) {
        this.value = angle / this.MAX_KNOB_ANGLE;
      } else if (angle <= MAX_ANGLE && angle > -180) {
        this.value = (360 + angle) / this.MAX_KNOB_ANGLE;
      }

      this.arrowContainer.style.transition = null;
    },

    _increment: function(delta) {
      if (this.value < 1) {
        var v = this.value + delta;
        this.value = Math.min(v, 1);
      }
    },

    _decrement: function(delta) {
      if (this.value > 0) {
        var v = this.value - delta;
        this.value = Math.max(v, 0);
      }
    },

    _mousewheel: function(e) {
      if (e.wheelDeltaY > 0) {
        this._increment(this.WHEEL_SENSITIVIY);
      } else {
        this._decrement(this.WHEEL_SENSITIVIY);
      }
    }
  });
}());