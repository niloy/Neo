"use strict";

var utils = require("../core/utils.js");
var TestView = require("../core/testView.js");

var TEXT = "A New Label";
var NEW_TEXT = "<HELLO>";

var LabelTest = TestView.extend({
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

module.exports = LabelTest;
