(function() {
  "use strict";

  Neo.Classes.PagerTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Pager"
      };
    },

    tests: function(pager) {
      pager.totalPages = 20;
      pager.currentPage = 15;

      describe("Pager", function() {
        // Write test cases here
      });
    }
  });
}());