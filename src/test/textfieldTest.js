(function() {
  "use strict";

  Neo.Classes.TextfieldTest = Neo.Classes.UIComponent.extend({
    buildDOM: function() {
      return {
        name: "Textfield",
        type: "search"
      };
    }
  });
}());