var fs = require("fs");
var path = require("path");

var ASSETS_SRC_PATH = "src/assets/";
var cssFiles = [];
var assetFiles = [];

// Generating make commands for css
function cssFilter(file) {
  return path.extname(file) === ".less";
}

["src/core/", "src/test/", "src/user/"].forEach(function(folder) {
  var files = fs.readdirSync(folder).filter(cssFilter).map(function(file) {
    return folder + file;
  });

  cssFiles = cssFiles.concat(files);
});

var cssTargets = [];

var cssStr = cssFiles.map(function(file) {
  var basename = path.basename(file, ".less");
  var target = "build/files/" + basename + ".css";

  cssTargets.push(target);

  var str = target + ": " + file + "\n\t"
    + "lessc -sm=on $< > $@ || rm $@";

  return str;
}).join("\n\n");

// Generating make commands for assets
var assetTargets = [];

var assetStr = fs.readdirSync(ASSETS_SRC_PATH).map(function(file) {
  var target = "build/assets/" + file;
  assetTargets.push(target);

  var str = target + ": " + ASSETS_SRC_PATH + file + "\n\t"
    + "cp $< $@";

  return str;
}).join("\n\n");

console.log("SHELL=cmd.exe\n");
console.log("assets: " + assetTargets.join("\\\n\t") + "\n");
console.log(assetStr);
console.log("css: " + cssTargets.join("\\\n\t") + "\n");
console.log(cssStr);
