"use strict";

var utils = require("./utils.js");
var UIComponent = require("./uiComponent.js");

//CSS: label.less

function Label(config) {
  this._text = utils.ifNull(config.text, this.NO_TEXT, "string,number");
  this._title = utils.ifNull(config.title, this._text, "string,number");
  UIComponent.call(this, config);
}

Label.prototype = Object.create(UIComponent.prototype);

Object.assign(Label.prototype, {
  NO_TEXT: "NO TEXT",

  init: function(config) {
  },

  buildDOM: function() {
    var dom = document.createElement("label");

    dom.textContent = this._text;
    dom.title = this._title;

    return dom;
  },

  get text() {
    return this._text;
  },

  set text(value) {
    utils.typeCheck(value, "string,number");

    this._text = value;
    this.dom.childNodes[0].textContent = this._text;
  },

  clear: function() {
    this.text = "";
  }
});

utils.registerComponent("Label", Label);
module.exports = Label;
