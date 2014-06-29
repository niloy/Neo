var fs = require("fs");
var path = require("path");

var str = fs.readdirSync("build/files/").filter(function(file) {
  return path.extname(file) === ".css";
}).map(function(file) {
  return "\t<link rel='stylesheet' href='files/" + file + "' />";
}).join("\n");

var index = fs.readFileSync("src/index.html", "utf-8");

var str = index.split("<!-- CSS -->").join(str);

console.log(str);
console.log("<!-- Created on " + new Date() + " -->");
