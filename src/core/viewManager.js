(function() {
  "use strict";

  Neo.Classes.ViewManager = function() {
    this.views = {};
    this.currentView = null;
    this.currentViewName = null;

    var viewMatch = window.location.search.match(/view=([a-z0-9]+)/i);
    var viewName = "index";   // Default view = index

    if (viewMatch && viewMatch.length) {
      viewName = viewMatch[1];
    }

    Neo.Loader.loadPackage(viewName, function() {
      var view = this._createInstanceAndAttachViewToDOM(viewName);
      this.currentView = view;
      this.currentViewName = viewName;
      this.views[viewName] = view;
    }.bind(this));
  };

  Neo.Classes.ViewManager.prototype = {
    loadView: function(viewName, success) {
      var successCb = success || function() {};

      if (this.currentViewName === viewName) {
        successCb();
        return;
      }

      if (viewName in this.views) {
        this.currentView.hide();
        this.views[viewName].show();
        this.currentView = this.views[viewName];
        this.currentViewName = viewName;
        successCb();
      } else {
        Neo.Loader.loadPackage(viewName, function() {
          this.currentView.hide();
          var view = this._createInstanceAndAttachViewToDOM(viewName);
          this.currentView = view;
          this.currentViewName = viewName;
          this.views[viewName] = view;
          successCb();
        }.bind(this));
      }
    },

    getCurrentView: function() {
      return this.currentView;
    },

    getCurrentViewName: function() {
      return this.currentViewName;
    },

    _createInstanceAndAttachViewToDOM: function(viewName) {
      // capitalize the first letter of the view name
      var className = viewName.charAt(0).toUpperCase() + viewName.substr(1);

      return Neo.createComponent({
        name: className,
        parentDom: Neo.viewContainer
      });
    }
  };
}());