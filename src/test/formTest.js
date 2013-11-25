(function() {
  "use strict";

  Neo.Classes.FormTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Form",
        component: {
          name: "Layout",
          items: [{
            component: {
              name: "Textfield",
              placeholder: "Username",
              fieldname: "username"
            }
          }, {
            component: {
              name: "Textfield",
              placeholder: "password",
              type: "password",
              fieldname: "password"
            }
          }, {
            component: {
              name: "Button",
              text: "Login"
            }
          }]
        },
        listeners: {
          submit: function() {
            var values = this.values;

            if (values.username === "hello" && values.password === "world") {
              Neo.App.alert("Welcome");
            } else {
              Neo.App.alert("Wrong credentials");
            }
          }
        }
      };
    },

    tests: function(Form) {
      describe("Form", function() {
        // Write test cases here
      });
    }
  });
}());