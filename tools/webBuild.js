let fs = require("fs");

let loader = require("../src/core/loader.js");
const MINJS = ".min.js";
const MINCSS = ".min.css";
const OUTFOLDER = "build/web/";
let includeTestView = false;

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--includeTestView") {
    includeTestView = true;
    break;
  }
}

let index = fs.readFileSync("src/index.html", "utf-8");
let commonPackageFiles = loader.getFilesForPackage("common");
createCombinedFile(commonPackageFiles.js, "common" + MINJS);
createCombinedFile(commonPackageFiles.css, "common" + MINCSS);

var packages = {};

for (let i in loader.userPackage) {
  packages[i] = loader.userPackage[i];
}

if (includeTestView) {
  for (let i in loader.corePackage) {
    if (i.substr(-4) === "Test") {
      packages[i] = loader.corePackage[i];
    }
  }
}

for (let i in packages) {
  let viewFiles = loader.getFilesForPackage(i);
  let jsFiles = viewFiles.js.filter(filterOutFiles.bind(commonPackageFiles.js));
  let cssFiles = viewFiles.css.filter(filterOutFiles.bind(commonPackageFiles.css));

  createCombinedFile(jsFiles, i + MINJS);
  createCombinedFile(cssFiles, i + MINCSS);
  createHTMLPage(i);
}

process.exit();

/***********************Functions start here***********************************/
function createCombinedFile(files, outFileName) {
  let concatContents = "";

  files.forEach(function(file) {
    let f = fs.readFileSync("src/" + file, "utf-8");
    concatContents += "\n" + f;
  });

  fs.writeFileSync(OUTFOLDER + "files/" + outFileName, markTimestamp(concatContents));
}

function markTimestamp(text, type) {
  var date = new Date();

  if (type === 'html') {
    return text + "<!-- Created on " + date + " -->";
  } else {
    return "/* Created on " + date + " */" + text;
  }
}

function filterOutFiles(filesToExclude, file) {
  return filesToExclude.indexOf(file) === -1;
}

function createHTMLPage(viewName) {
  let r = '\n\
  <link rel="stylesheet" href="files/common.min.css" />\n\
  <link rel="stylesheet" href="files/' + viewName + MINCSS + '" />\n\
  <script src="files/common.min.js"></script>\n\
  <script src="files/' + viewName + MINJS + '"></script>\n\
  <script>\n\
    Neo.CURRENT_VIEW_NAME = "' + viewName + '";\n\
    window.onload = Neo.appStart;\n\
  </script>\n\
  ';

  let htmlPage = index
    .replace('<script src="core/loader.js"></script>', r)
    .replace('Neo.ENV = "dev"', 'Neo.ENV = "web"');
  fs.writeFileSync(OUTFOLDER + viewName + ".html", markTimestamp(htmlPage, 'html'));
}