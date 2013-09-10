(function() {
  "use strict";

  var num1 = null;
  var num2 = null;
  var operator = null;

  Neo.Classes.Calculator = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);

      this.registerModel({
        attributes: {
          result: 0,
          num: 0,
          operator: null
        },
        subscribe: {
          "number clicked": function(number) {
            this.num = this.num * 10 + number;
            this.publish("update display", this.num);
          },

          "operator clicked": function(operator) {
            if (this.operator !== null) {
              switch(this.operator) {
                case "+":
                  this.result += this.num;
                  break;
                case "-":
                  this.result -= this.num;
                  break;
                case "*":
                  this.result *= this.num;
                  break;
                case "/":
                  this.result /= this.num;
                  break;
              }

              if (operator !== "=") {
                this.operator = operator;
              }

              this.publish("update display", this.result);
            } else {
              this.result = this.num;
              this.operator = operator;
            }

            if (operator !== "=") {
              this.num = 0;
            }
          },

          "clear clicked": function() {
            this.result = 0;
            this.operator = null;
            this.num = 0;
            this.publish("update display", 0);
          }
        }
      });
    },

    buildDOM: function() {
      return {
        name: "Layout",
        items: [{
          component: {
            name: "Label",
            cls: "display",
            text: "0",
            subscribe: {
              "update display": function(num) {
                this.text = num;
              }
            }
          }
        }, {
          component: {
            name: "Layout",
            orient: "horizontal",
            items: [{
              cls: "calcButton",
              component: {
                name: "Button",
                text: "7",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 7);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "8",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 8);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "9",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 9);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "+",
                listeners: {
                  click: function() {
                    this.publish("operator clicked", "+");
                  }
                }
              }
            }]
          }
        }, {
          component: {
            name: "Layout",
            orient: "horizontal",
            items: [{
              cls: "calcButton",
              component: {
                name: "Button",
                text: "4",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 4);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "5",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 5);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "6",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 6);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "-",
                listeners: {
                  click: function() {
                    this.publish("operator clicked", "-");
                  }
                }
              }
            }]
          }
        }, {
          component: {
            name: "Layout",
            orient: "horizontal",
            items: [{
              cls: "calcButton",
              component: {
                name: "Button",
                text: "1",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 1);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "2",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 2);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "3",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 3);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "*",
                listeners: {
                  click: function() {
                    this.publish("operator clicked", "*");
                  }
                }
              }
            }]
          }
        }, {
          component: {
            name: "Layout",
            orient: "horizontal",
            items: [{
              cls: "calcButton",
              component: {
                name: "Button",
                text: "C",
                listeners: {
                  click: function() {
                    this.publish("clear clicked");
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "0",
                listeners: {
                  click: function() {
                    this.publish("number clicked", 0);
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "=",
                listeners: {
                  click: function() {
                    this.publish("operator clicked", "=");
                  }
                }
              }
            }, {
              cls: "calcButton",
              component: {
                name: "Button",
                text: "/",
                listeners: {
                  click: function() {
                    this.publish("operator clicked", "/");
                  }
                }
              }
            }]
          }
        }]
      };
    }
  });
}());