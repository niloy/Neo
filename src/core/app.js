Neo.startApp = function() {
  "use strict";

  var viewName = Neo.currentViewName;

  // capitalize the first letter of the view name
  var className = viewName.charAt(0).toUpperCase() + viewName.substr(1);

  Neo.currentView = Neo.createComponent({
    name: className,
    parent: "ROOT"
  });
};