(function() {
  "use strict";

  function Loader(readyCallback) {
    this.packages = null;
    this.loadedFiles = {};

    this.ajax("core/package.json", function(packageText) {
      try {
        this.packages = JSON.parse(packageText);
      } catch (ex) {
        throw("package.json is not a valid JSON");
      }

      readyCallback.call(this);
    }.bind(this));

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

      function categorizeFiles(files) {
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

      var fileTypes = categorizeFiles(files);

      function removeLoadedFiles(file) {
        return !(file in this.loadedFiles);
      }

      this.loadCSSFiles(fileTypes.css.filter(removeLoadedFiles.bind(this)));
      this.loadJSFiles(fileTypes.js.filter(removeLoadedFiles.bind(this)), success);
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

      return resolveNode(packageName);
    }
  };

  new Loader(function() {
    Neo.Loader = this;
    
    this.loadPackage("common", function() {
      Neo.ViewManager = new Neo.Classes.ViewManager();
    });
  });
}());