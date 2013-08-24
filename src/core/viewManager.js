(function() {
  "use strict";

  Neo.Classes.ViewManager = function() {
    this.views = {};
    this.currentView = null;
    this.currentViewName = null;
    this.face = "front";
    this.frontSide = document.getElementById("front");
    this.backSide = document.getElementById("back");
    this.card = document.getElementById("card");

    var viewMatch = window.location.search.match(/view=([a-z0-9]+)/i);
    var viewName = "index";   // Default view = index

    if (viewMatch && viewMatch.length) {
      viewName = viewMatch[1];
    }

    this.loadView(viewName);
  };

  Neo.Classes.ViewManager.prototype = {
    loadView: function(viewName, success) {
      var successCb = success || function() {};
      var self = this;

      if (this.currentViewName === viewName) {
        successCb();
        return;
      }

      function switchView(newViewName) {
        self.card.classList.toggle("flipped");
        self.currentViewName = newViewName;
        self.currentView = self.views[newViewName];
      }

      this.face = this.face === "front" ? "back" : "front";

      if (viewName in this.views) {
        if (this.face === "front") {
          this.frontSide.removeChild(this.frontSide.childNodes[0]);
          this.frontSide.appendChild(this.views[viewName].dom);
        } else {
          this.backSide.removeChild(this.backSide.childNodes[0]);
          this.backSide.appendChild(this.views[viewName].dom);
        }

        switchView(viewName);
      } else {
        Neo.Loader.loadPackage(viewName, function() {
          var view = this._createInstanceAndAttachViewToDOM(viewName, this.face);
          this.views[viewName] = view;
          switchView(viewName);
        }.bind(this));
      }
    },

    getCurrentView: function() {
      return this.currentView;
    },

    getCurrentViewName: function() {
      return this.currentViewName;
    },

    _createInstanceAndAttachViewToDOM: function(viewName, side) {
      // capitalize the first letter of the view name
      var className = viewName.charAt(0).toUpperCase() + viewName.substr(1);

      return Neo.createComponent({
        name: className,
        parentDom: side === "front" ? this.frontSide : this.backSide
      });
    }
  };
}());