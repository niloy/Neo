(function() {
  "use strict";

  // PhantomJS doesn't support bind yet, hence the required polyfill
  // https://github.com/ariya/phantomjs/issues/10522
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                                   ? this
                                   : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
  // PhantomJS polyfill ends here

  var isNode = false;

  if (typeof module !== "undefined" && module.exports) {
    isNode = true;
  }

  function Loader(readyCallback) {
    this.corePackage = null;
    this.userPackage = null;
    this.packages = null;
    this.loadedFiles = {};

    function parseJSON(text) {
      try {
        return JSON.parse(text);
      } catch (ex) {
        throw("package.json is not a valid JSON");
      }
    }

    function mergePackages(pack1, pack2) {
      var finalPack = pack1;

      for (var i in pack2) {
        if (i in pack1) {
          for (var j in pack2[i]) {
            finalPack[i][j] = pack2[i][j];
          }
        } else {
          finalPack[i] = pack2[i];
        }
      }

      return finalPack;
    }

    var packageLoaded = function(packageText) {
      if (this.corePackage !== null && this.userPackage !== null) {
        this.packages = mergePackages(this.corePackage, this.userPackage);
        readyCallback.call(this);
      }
    }.bind(this);

    if (isNode) {
      this.corePackage = require("./package.json");
      this.userPackage = require("../user/package.json");
      packageLoaded();
    } else {
      this.ajax("core/package.json", function(text) {
        this.corePackage = parseJSON(text);
        packageLoaded();
      }.bind(this));
      this.ajax("user/package.json", function(text) {
        this.userPackage = parseJSON(text);
        packageLoaded();
      }.bind(this));
    }

    return null;
  };

  Loader.prototype = {
    ajax: function(url, complete) {
      var xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.onreadystatechange = function(status) {
        if (xhr.status === 200 && xhr.readyState === 4) {
          complete(xhr.responseText);
        }
      };
      xhr.send(null);
    },

    loadPackage: function(packageName, success) {
      if (!(packageName in this.packages)) {
        throw new Error("unable to find package in packages.json -> " + packageName);
      }

      var files = this.getFilesForPackage(packageName);

      function removeLoadedFiles(file) {
        return !(file in this.loadedFiles);
      }

      this.loadCSSFiles(files.css.filter(removeLoadedFiles.bind(this)));
      this.loadJSFiles(files.js.filter(removeLoadedFiles.bind(this)), success);
    },

    loadCSSFiles: function(files) {
      files.forEach(function(file) {
        var link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = file;
        this.loadedFiles[file] = true;

        document.head.appendChild(link);
      }.bind(this));
    },

    loadJSFiles: function(files, completeCallback) {
      var index = 0;
      var self = this;

      function loadJS(file, complete) {
        var script = document.createElement("script");

        script.src = file;
        script.onload = complete;
        document.head.appendChild(script);
        self.loadedFiles[file] = true;
      }

      function jsFileLoadComplete() {
        index++;

        if (index === files.length) {
          completeCallback();
        } else {
          loadJS(files[index], jsFileLoadComplete);
        }
      }

      loadJS(files[index], jsFileLoadComplete);
    },

    getFilesForPackage: function(packageName) {
      var oThis = this;

      function resolveNode(nodeName) {
        var node = oThis.packages[nodeName];
        var files = [];
        var requires;

        if ("requires" in node) {
          requires = Array.isArray(node.requires) ? node.requires : [node.requires];
        } else {
          requires = [];
        }

        requires.forEach(function(requiredNode) {
           files = files.concat(resolveNode(requiredNode));
        });

        if (Array.isArray(node.files)) {
          files = files.concat(node.files);
        } else {
          files.push(node.files);
        }

        return files;
      }

      return this._categorizeFiles(resolveNode(packageName));
    },

    _categorizeFiles: function(files) {
      var category = {
        js: [],
        css: [],
        image: [],
        font: [],
        unknown: []
      };
      var extensionsMap = {
        js: ["js"],
        css: ["css"],
        image: ["png", "jpg", "jpeg", "gif"]
      };

      files.forEach(function(file) {
        var ext = file.substr(file.lastIndexOf(".") + 1);
        var typeFound = false;

        for (var fileType in extensionsMap) {
          if (extensionsMap[fileType].indexOf(ext) !== -1) {
            // match found, 'file' belongs to type 'fileType'
            category[fileType].push(file);
            typeFound = true;
            break;
          }
        }

        if (!typeFound) {
          category.unknown.push(file);
        }
      });

      return category;
    }
  };

  new Loader(function() {
    if (isNode) {
      module.exports = this;
    } else {
      Neo.Loader = this;

      this.loadPackage("common", function() {
        Neo.ViewManager = new Neo.Classes.ViewManager();
      });
    }
  });
}());