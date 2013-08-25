(function() {
  "use strict";

  var TEXT = "HELLO";

  Neo.Classes.TextfieldTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Textfield",
        value: TEXT,
        validation: /[a-zA-Z]/,
        required: true,
        autofocus: true,
        multiline: true,
        fieldname: "abc",
        placeholder: "enter some text here"
      };
    },

    tests: function(txt) {
      describe("Textfield", function() {
        it("must be true", function() {
          expect(true).to.be(true);
        });

        it("value getter must work", function() {
          expect(txt.value).to.be(TEXT);
        });

        it("value setter must work", function() {
          txt.value = "WORLD";
          expect(txt.value).to.be("WORLD");
        });

        it("clear() must work", function() {
          txt.clear();
          expect(txt.value).to.be("");
        });

        it("fieldname getter must work", function() {
          expect(txt.fieldname).to.be("abc");
        });

        it("fieldname setter must work", function() {
          txt.fieldname = "xyz";
          expect(txt.fieldname).to.be("xyz");
        });
      });
    }
  });
}());