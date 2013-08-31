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
            switch (e.keyCode) {
              case Neo.KeyCodes.ENTER:
                this.publish("enter pressed", this.value);
                break;
              case Neo.KeyCodes.UP:
                this.publish("up pressed", this.value);
                break;
              case Neo.KeyCodes.DOWN:
                this.publish("down pressed", this.value);
                break;
              case Neo.KeyCodes.LEFT:
                this.publish("left pressed", this.value);
                break;
              case Neo.KeyCodes.RIGHT:
                this.publish("right pressed", this.value);
                break;
              case Neo.KeyCodes.BACKSPACE:
                this.publish("backspace pressed", this.value);
                break;
            }
          }
        },
        subscribe: {
          "enter pressed": function(text) {
            this.label = text;
            console.log("enter pressed", text, this);
          },
          "up pressed OR down pressed": function(text) {
            console.log("up or down pressed", text, this);
          },
          "left pressed AND right pressed": function(text) {
            console.log("left and right pressed", text, this);
          },
          "ONCE backspace pressed": function(text) {
            console.log("backspace pressed first time", text, this);
          }
        }
      };
    }
  });
}());