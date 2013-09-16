(function() {
  "use strict";

  var ALT = "calvin and hobbes";

  Neo.Classes.ImageTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Image",
        src: "assets/calvinhobbes.jpg",
        alt: ALT,
        width: "400px"
      };
    },

    tests: function(img) {
      describe("Image", function() {
        it("should render on page", function() {
          expect(document.querySelector(".compImage")).to.be(img.dom);
        });

        it("should have alt text", function() {
          expect(document.querySelector(".compImageInner").alt).to.be(ALT);
        });

        it("alt getter must work", function() {
          expect(img.alt).to.be(ALT);
        });

        it("alt setter must work", function() {
          img.alt = "hello";
          expect(img.alt).to.be("hello");
        });
      });
    }
  });
}());