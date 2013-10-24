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
          tutorialInProgress: false
        },
        subscribe: {
          "run tutorial": function() {
            var self = this;
            self.tutorialInProgress = true;

            this.publish("clear clicked");
            Neo.App.alert({
              text: "Welcome to the tutorial mode of the calculator, lets say \
we want to calculate 2 + 3 = ?",
              title: "Calculator",
              callback: function() {
                self.publish("show tutorial step 1");
              }
            });
          },

          "number clicked": function(num) {
            if (this.tutorialInProgress) {
              if (num === 2) {
                this.publish("hide tutorial step 1");
                this.publish("show number displayed");
              } else if (num === 3) {
                this.publish("hide step 4");
                this.publish("show step 5");
              }
            }
          },

          "operator clicked": function(operator) {
            if (this.tutorialInProgress) {
              if (operator === "+") {
                this.publish("hide step 3");
                this.publish("show step 4");
              } else if (operator === "=") {
                this.publish("hide step 5");
                this.publish("show step 6");
              }
            }
          },

          "tutorial end": function() {
            this.tutorialInProgress = false;
          }
        }
      });

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
              },

              "show number displayed": function() {
                this.hint = {
                  name: "Layout",
                  items: [{
                    component: {
                      name: "Label",
                      text: "As you can see, the number you pressed is displayed here."
                    }
                  }, {
                    component: {
                      name: "Button",
                      text: "Ok",
                      listeners: {
                        click: function() {
                          this.publish("hide step 2");
                          this.publish("show step 3");
                        }
                      }
                    }
                  }]
                };
                this.highlight = true;
              },

              "hide step 2": function() {
                this.hint = null;
                this.highlight = false;
              },

              "show step 6": function() {
                this.hint = "Taadaa! You can see the answer here";
                setTimeout(function() {
                  this.hint = null;
                  this.publish("tutorial end");
                }.bind(this), 5000);
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
                },
                subscribe: {
                  "show step 3": function() {
                    this.hint = "Now press this button since we want to perform addition";
                  },

                  "hide step 3": function() {
                    this.hint = null;
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
                },
                subscribe: {
                  "show tutorial step 1": function() {
                    this.hint = "Step 1: Press this button";
                  },

                  "hide tutorial step 1": function() {
                    this.hint = null;
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
                },
                subscribe: {
                  "show step 4": function() {
                    this.hint = "Now press this button";
                  },

                  "hide step 4": function() {
                    this.hint = null;
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
                tooltip: "Clears current calculation",
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
                },
                subscribe: {
                  "show step 5": function() {
                    this.hint = "Now press this to view the result!";
                  },

                  "hide step 5": function() {
                    this.hint = null;
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
        }, {
          component: {
            name: "Layout",
            items: [{
              component: {
                name: "Button",
                text: "How to use calculator?",
                listeners: {
                  click: function() {
                    this.publish("run tutorial");
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