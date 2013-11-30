(function() {
  "use strict";

  Neo.Classes.CheckboxTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Checkbox",
        label: "Remember me?",
        checked: true,
        listeners: {
          check: function() {
            console.log('checked');
          },

          uncheck: function() {
            console.log('unchecked');
          }
        }
      };
    },

    tests: function(checkbox) {
      var compCheckbox = document.querySelector(".compCheckbox");

      describe("Checkbox", function() {
        it("must have the label", function() {
          expect(compCheckbox.textContent).to.be("Remember me?");
        });

        it("must be checked", function() {
          var c = document.querySelector(".checkbox");
          expect(c.checked).to.be(true);
        });

        it("checked getter must work", function() {
          expect(checkbox.checked).to.be(true);
        });

        it("checked setter must work", function() {
          checkbox.checked = false;
          expect(checkbox.checked).to.be(false);
        });
      });
    }
  });
}());