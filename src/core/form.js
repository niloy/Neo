(function() {
  "use strict";

  Neo.Classes.Form = Neo.Classes.UIComponent.extend({
    init: function(config) {
      var e = new Error("form 'component' missing");

      this._component = Neo.ifNull(config.component, e, "object");

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var form = document.createElement("form");

      form.addEventListener("submit", function(e) {
        e.preventDefault();
      }.bind(this));

      this._component.parentDom = form;
      var child = this.appendComponent(this._component);
      this.children.push(child);

      return form;
    }
  });
}());