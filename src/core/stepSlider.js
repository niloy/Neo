(function() {
  "use strict";

  Neo.Classes.StepSlider = Neo.Classes.Input.extend({
    init: function(config) {
      var stepsMissing = new Error("'steps' missing");
      var configSteps = Neo.ifNull(config.steps, stepsMissing, "object");

      this.ruler = null;
      this.dragger = null;
      this.startX = null;
      this.labelContainer = null;
      this.steps = [];

      for (var i in configSteps) {
        this.steps.push({
          value: i,
          text: configSteps[i]
        });
      }

      Neo.Classes.Input.call(this, config);

      this._setValueWithoutChangeTrigger(config.value || this.steps[0].value);
    },

    buildDOM: function() {
      var self = this;
      var closestStep;

      function mouseup(e) {
        document.body.removeEventListener("mouseup", mouseup);
        self.dom.removeEventListener("mousemove", mousemove);
        self.dragger.style.pointerEvents = "";
        self._value = closestStep.value;
        self.trigger("change");
      }

      function mousemove(e) {
        e.preventDefault();
        closestStep = self._getClosestStep(e.offsetX);
        self._moveDragger(closestStep.position);
      }

      this.dom.addEventListener("click", function(e) {
        var closestStep = this._getClosestStep(e.offsetX);
        this.value = closestStep.value;
      }.bind(this));

      this.ruler = document.createElement("div");
      this.ruler.className = "ruler";
      this.dom.appendChild(this.ruler);

      this.dragger = document.createElement("div");
      this.dragger.className = "dragger";
      this.dom.appendChild(this.dragger);
      this.dragger.addEventListener("mousedown", function(e) {
        this.startX = e.screenX;
        this.dragger.style.pointerEvents = "none";
        document.body.addEventListener("mouseup", mouseup);
        this.dom.addEventListener("mousemove", mousemove);
      }.bind(this));

      this.labelContainer = document.createElement("div");
      this.labelContainer.className = "labelContainer";
      this.dom.appendChild(this.labelContainer);

      this._markStepsOnRuler();
    },

    _markStepsOnRuler: function() {
      var positions = [0];
      var spaceBetween = Math.floor(100 / (this.steps.length - 1));

      for (var i = 0; i < this.steps.length - 2; i++) {
        positions.push((i + 1) * spaceBetween);
      }

      positions.push(100);

      positions.forEach(function(p, i) {
        var step = document.createElement("div");
        step.className = "rulerStep";

        if (p === 0) {
          step.classList.add("first");
        } else if (p === 100) {
          step.classList.add("last");
        }

        step.style.left = p + "%";
        this.ruler.appendChild(step);

        var stepLabel = document.createElement("div");
        stepLabel.className = "rulerStepLabel";
        stepLabel.style.left = p + "%";
        stepLabel.textContent = this.steps[i].text;
        this.ruler.appendChild(stepLabel);

        this.steps[i].position = p;
      }.bind(this));
    },

    get value() {
      return this._value;
    },

    set value(value) {
      this._setValueWithoutChangeTrigger(value);
      this.trigger("change");
    },

    _setValueWithoutChangeTrigger: function(value) {
      Neo.typeCheck(value, "string,number");

      var f = this.steps.filter(function(s) {
        return s.value === value.toString();
      });

      if (f.length === 0) {
        throw new Error("slider value not found -> " + value);
      }

      this._value = value;
      this._moveDragger(f[0].position);
    },

    _moveDragger: function(position) {
      position = parseInt(position, 10);
      this.dragger.style.left = position + "%";
    },

    _getClosestStep: function(x) {
      var xPercent = Math.floor(x / this.dom.offsetWidth * 100);
      var range = 50 / (this.steps.length - 1);
      var closestStep;

      for (var i = 0; i < this.steps.length; i++) {
        var position = this.steps[i].position;

        if (Math.abs(xPercent - position) <= range) {
          closestStep = this.steps[i];
          break;
        }
      }

      return closestStep;
    }
  });
}());