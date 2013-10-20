let fs = require("fs");

let loader = require("../src/core/loader.js");
const MINJS = "everything.min.js";
const MINCSS = "everything.min.css";
const OUTFOLDER = "build/webApp/";
const START_PAGE = 'helloWorld';

let index = fs.readFileSync("src/index.html", "utf-8");

// Create a meta package called '_all_' that requires all other packages
loader.packages._all_ = {
  files: [],
  requires: Object.keys(loader.packages)
};

let allPackageFiles = loader.getFilesForPackage("_all_");
createCombinedFile(allPackageFiles.js, MINJS);
createCombinedFile(allPackageFiles.css, MINCSS);
createHTMLPage(START_PAGE);

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

function createHTMLPage(viewName) {
  let r = '\n\
  <link rel="stylesheet" href="files/' + MINCSS + '" />\n\
  <script src="files/' + MINJS + '"></script>\n\
  <script>\n\
    Neo.CURRENT_VIEW_NAME = "' + viewName + '";\n\
    window.onload = Neo.appStart;\n\
  </script>\n\
  ';

  let htmlPage = index
    .replace('<script src="core/loader.js"></script>', r)
    .replace('Neo.ENV = "dev"', 'Neo.ENV = "webApp"');
  fs.writeFileSync(OUTFOLDER + "index.html", markTimestamp(htmlPage, 'html'));
}