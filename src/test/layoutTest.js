(function() {
  "use strict";

  Neo.Classes.LayoutTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Layout",
        orient: "horizontal",
        items: [{
          cls: "abc",
          size: "100px",
          component: {name: "Button", text: "Hello"}
        }, {
          cls: "xyz",
          size: "200px",
          component: {name: "Button", text: "World"}
        }]
      };
    },

    tests: function(layout) {
      describe("Layout", function() {
        it("should have 2 children", function() {
          expect(layout.children.length).to.be(2);
        });

        it("empty() must work", function() {
          layout.empty();
          expect(layout.children.length).to.be(0);
        });

        it("insertItems() should work", function() {
          var items = [{
            cls: "pqr",
            size: "100px",
            component: {name: "Button", text: "Inserted"}
          }, {
            cls: "ijk",
            size: "150px",
            component: {name: "Button", text: "Button"}
          }];

          layout.insertItems(items, 1);
          expect(layout.children.length).to.be(2);
        });

        it("removeItems() must work", function() {
          layout.removeItems(1);
          expect(layout.children.length).to.be(1);
        });
      });
    }
  });
}());