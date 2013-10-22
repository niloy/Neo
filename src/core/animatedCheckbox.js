(function() {
  "use strict";

  // Paths taken from http://tympanus.net/Development/AnimatedCheckboxes/
  // Line Animation from http://jakearchibald.com/2013/animated-line-drawing-svg/

  var SVG = "http://www.w3.org/2000/svg";

  Neo.Classes.AnimatedCheckbox = Neo.Classes.Input.extend({
    PATH_TICK: "M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.63\
6,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.9\
58-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-\
20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16",
    PATH_CROSS: "M 10 10 L 90 90 M 90 10 L 10 90",
    PATH_SCRIBBLE: "M15.833,24.334c2.179-0.443,4.766-3.995,6.545-5.359 c1.76-1.\
35,4.144-3.732,6.256-4.339c-3.983,3.844-6.504,9.556-10.047,13.827c-2.325,2.802-\
5.387,6.153-6.068,9.866 c2.081-0.474,4.484-2.502,6.425-3.488c5.708-2.897,11.316\
-6.804,16.608-10.418c4.812-3.287,11.13-7.53,13.935-12.905 c-0.759,3.059-3.364,6\
.421-4.943,9.203c-2.728,4.806-6.064,8.417-9.781,12.446c-6.895,7.477-15.107,14.1\
09-20.779,22.608 c3.515-0.784,7.103-2.996,10.263-4.628c6.455-3.335,12.235-8.381\
,17.684-13.15c5.495-4.81,10.848-9.68,15.866-14.988 c1.905-2.016,4.178-4.42,5.55\
6-6.838c0.051,1.256-0.604,2.542-1.03,3.672c-1.424,3.767-3.011,7.432-4.723,11.07\
6 c-2.772,5.904-6.312,11.342-9.921,16.763c-3.167,4.757-7.082,8.94-10.854,13.205\
c-2.456,2.777-4.876,5.977-7.627,8.448 c9.341-7.52,18.965-14.629,27.924-22.656c4\
.995-4.474,9.557-9.075,13.586-14.446c1.443-1.924,2.427-4.939,3.74-6.56 c-0.446,\
3.322-2.183,6.878-3.312,10.032c-2.261,6.309-5.352,12.53-8.418,18.482c-3.46,6.71\
9-8.134,12.698-11.954,19.203 c-0.725,1.234-1.833,2.451-2.265,3.77c2.347-0.48,4.\
812-3.199,7.028-4.286c4.144-2.033,7.787-4.938,11.184-8.072 c3.142-2.9,5.344-6.7\
58,7.925-10.141c1.483-1.944,3.306-4.056,4.341-6.283c0.041,1.102-0.507,2.345-0.8\
76,3.388 c-1.456,4.114-3.369,8.184-5.059,12.212c-1.503,3.583-3.421,7.001-5.277,\
10.411c-0.967,1.775-2.471,3.528-3.287,5.298 c2.49-1.163,5.229-3.906,7.212-5.828\
c2.094-2.028,5.027-4.716,6.33-7.335c-0.256,1.47-2.07,3.577-3.02,4.809",

    init: function(config) {
      this._label = Neo.ifNull(config.label, null, "string");
      this.labelDOM = null;
      this.path = null;
      this._checked = Neo.ifNull(config.checked, false, "boolean");
      this.svg = null;
      this._type = Neo.ifNull(config.type, "tick", "{tick|cross|scribble}");
      this.type = this["PATH_" + this._type.toUpperCase()];

      Neo.Classes.Input.call(this, config);
    },

    buildDOM: function() {
      var label = document.createElement("label");

      var svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("class", "svg");
      svg.addEventListener("click", this._checkBoxClicked.bind(this));
      this.svg = svg;

      var path = document.createElementNS(SVG, "path");
      path.setAttribute("d", this.type);
      path.setAttribute("class", "checkboxPath " + this._type);
      this.path = path;

      if (this._checked) {
        this._check();
      }

      label.appendChild(svg);

      var span = document.createElement("span");
      span.className = "label";
      label.appendChild(span);
      span.addEventListener("click", this._checkBoxClicked.bind(this));
      this.labelDOM = span;

      if (this._label) {
        this.label = this._label;
      }

      return label;
    },

    get checked() {
      return this._checked;
    },

    set checked(value) {
      Neo.typeCheck(value, "boolean");

      if (value === true && this._checked === false) {
        this._check();
      } else if (value === false && this._checked === true) {
        this._uncheck();
      }
    },

    _check: function() {
      this.svg.appendChild(this.path);
      this.path.getBoundingClientRect();
      this.path.style.strokeDashoffset = "0";
      this._checked = true;
    },

    _uncheck: function() {
      this.svg.removeChild(this.path);
      this.path.style.strokeDashoffset = null;
      this._checked = false;
    },

    _checkBoxClicked: function() {
      this.toggle();
    },

    toggle: function() {
      this.checked ? this.checked = false : this.checked = true;
    },

    get label() {
      return this._label;
    },

    set label(value) {
      Neo.typeCheck(value, "string");
      this._label = value;
      this.labelDOM.textContent = value;
    },

    get value() {
      return this.checked;
    },

    set value(value) {
      this.checked = value;
    }
  });
}());