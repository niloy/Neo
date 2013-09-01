(function() {
  "use strict";

  Neo.Classes.TestView = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);

      mocha.setup("bdd");
      this.tests(this.children[0]);
      window.testComponent = this.children[0];
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
}());