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
          expect(lbldom.innerText).to.be(TEXT);
        });

        it("setText() should work", function() {
          label.setText(NEW_TEXT);
          expect(lbldom.innerText).to.be(NEW_TEXT);
        });

        it("getText() should work", function() {
          expect(label.getText()).to.be(NEW_TEXT);
        });
      });
    }
  });
}());