(function() {
  "use strict";

  Neo.Classes.ComponentList = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var list = {
        helloWorld: "Hello World",
        buttonTest: "Button",
        labelTest: "Label",
        imageTest: "Image",
        layoutTest: "Layout",
        textfieldTest: "Textfield",
        checkboxTest: "Checkbox",
        calculator: "Calculator",
        tabTest: "Tab",
        dialogTest: "Dialog Box",
        alertTest: "Alert Box"
      };

      var layoutItems = Object.keys(list).map(function(viewName) {
        return {
          cls: "aComponent",
          component: {
            name: "Button",
            text: list[viewName],
            listeners: {
              click: function() {
                Neo.ViewManager.loadView(viewName, null, true);
              }
            }
          }
        };
      });

      return {
        name: "Layout",
        items: [{
          component: {
            name: "Label",
            text: "These are the currently implemented components:"
          }
        }, {
          component: {
            name: "Layout",
            orient: "horizontal",
            items: layoutItems
          }
        }]
      };
    }
  });
}());