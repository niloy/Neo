"use strict";
var fs = require("fs");

var componentName = process.argv[2];
var parentClass = process.argv[3] || "UIComponent";

if (componentName == null) {
  console.log("ERROR: Component name missing");
  process.exit(1);
}

var componentTemplate = fs.readFileSync("tools/componentTemplate.js", "utf-8");
var testViewTemplate = fs.readFileSync("tools/testViewTemplate.js", "utf-8");
var packageTemplate = fs.readFileSync("tools/packageTemplate.js", "utf-8");
var filename = componentName.charAt(0).toLowerCase() + componentName.substr(1);

componentTemplate = componentTemplate
                      .split("{ComponentName}")
                      .join(componentName)
                      .split("{ParentClass}")
                      .join(parentClass);

testViewTemplate = testViewTemplate.split("{ComponentName}").join(componentName);

packageTemplate = packageTemplate
                    .split("{ComponentName}")
                    .join(componentName)
                    .split("{filename}")
                    .join(filename)
                    .split("{requires}")
                    .join(parentClass);

fs.writeFileSync("src/core/" + filename + ".js", componentTemplate);
fs.writeFileSync("src/core/" + filename + ".css", "");
fs.writeFileSync("src/test/" + filename + "Test.js", testViewTemplate);

console.log(packageTemplate);

process.exit();