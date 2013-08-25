(function() {
  "use strict";

  var TEXT = "A New Label";
  var NEW_TEXT = "<HELLO>";

  Neo.Classes.LabelTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Label",
        text: "A New Label",
        listeners: {
          click: function() {
            console.log(this);
          }
        }
      };
    },

    tests: function(label) {
      var lbldom = document.querySelector(".compLabelInner");

      describe("Label", function() {
        it("should have text -> " + TEXT, function() {
          expect(lbldom.textContent).to.be(TEXT);
        });

        it("text getter should work", function() {
          expect(label.text).to.be(TEXT);
        });

        it("text setter should work", function() {
          label.text = NEW_TEXT;
          expect(label.text).to.be(NEW_TEXT);
        });
      });
    }
  });
}());