(function() {
  "use strict";

  var BUTTON_TEXT = "Sample Button";

  Neo.Classes.ButtonTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Button",
        text: BUTTON_TEXT,
        listeners: {
          click: function() {
            alert("You have clicked on the button");
          }
        }
      };
    },

    tests: function(button) {
      describe("Button", function() {
        var dom = document.querySelector(".compButtonInner");

        it("should have text -> " + BUTTON_TEXT, function() {
          expect(dom.innerText).to.be(BUTTON_TEXT);
        });

        it("getText() should work", function() {
          expect(button.getText()).to.be(BUTTON_TEXT);
        });

        it("setText() should work", function() {
          button.setText("WASSUP");
          expect(button.getText()).to.be("WASSUP");
        });
      });
    }
  });
}());