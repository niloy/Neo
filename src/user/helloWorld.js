"use strict";

var UIComponent = require("../core/uiComponent.js");
require("../core/label.js");

//CSS: helloWorld.less

function HelloWorld(config) {
  UIComponent.call(this, config);
}

HelloWorld.prototype = Object.create(UIComponent.prototype);

Object.assign(HelloWorld.prototype, {
  buildDOM: function() {
    return {
      name: "Label",
      text: "Hello World"
    };
  }
});

window.onload = function() {
  var h = new HelloWorld({
    parentDom: document.body,
    parent: "APPLICATION_ROOT",
    name: "HelloWorld"
  });
};

module.exports = HelloWorld;
