"use strict";

require("./mocha.js");
require("./expect.js");
var UIComponent = require("./uiComponent.js");

var TestView = UIComponent.extend({
  init: function(config) {
    UIComponent.call(this, config);

    mocha.setup("bdd");
    this.tests(this.firstChild);
    window.testComponent = this.firstChild;
    var results = mocha.run(function() {
      results && console.log("Failed: " + results.failures);
    });
  },

  buildDOM: function() {
    this.addClass("compTestView");

    var syntaxTip = document.createElement("a");
    syntaxTip.href = "https://github.com/LearnBoost/expect.js/blob/master/README.md";
    syntaxTip.innerHTML = "Click here to see syntax for writing tests";
    syntaxTip.target = "_blank";
    this.dom.appendChild(syntaxTip);

    var mochaDiv = document.createElement("div");
    mochaDiv.id = "mocha";
    this.dom.appendChild(mochaDiv);

    return this.buildComponent();
  },

  tests: function() {
    throw new Error("Write some tests!!!");
  },

  buildComponent: function() {
    throw new Error("please override 'buildComponent'");
  }
});

module.exports = TestView;
