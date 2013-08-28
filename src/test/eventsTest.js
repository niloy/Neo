(function() {
  "use strict";

  Neo.Classes.EventsTest = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      return {
        name: "Textfield",
        label: "A simple textfield",
        listeners: {
          keyup: function(e) {
            if (e.keyCode === Neo.KeyCodes.ENTER) {
              this.publish("enter pressed", this.value);
            }
          }
        },
        subscribe: {
          "enter pressed": function(text) {
            this.label = text;
          }
        }
      };
    }
  });
}());