(function() {
  "use strict";

  Neo.Classes.Layout = Neo.Classes.UIComponent.extend({
    init: function(config) {
      this._items = Neo.ifNull(config.items, [], "array");
      this.orient = Neo.ifNull(config.orient, "vertical", "{vertical|horizontal}");

      Neo.Classes.UIComponent.call(this, config);
    },

    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",

    buildDOM: function() {
      this.dom.classList.add(this.orient === this.VERTICAL ? "vertical" : "horizontal");
      var r = this._buildDocumentFragment(this._items);
      this.dom.appendChild(r.documentFragment);
      this.children = this.children.concat(r.children);
    },

    getItem: function(index) {
      Neo.ifNull(index, new Error("'index' required"), "number");

      return this.children[index];
    },

    insertItems: function(items, insertAt) {
      items = Neo.ifNull(items, new Error("'items' required for inserting"), "array,object");
      insertAt = Neo.ifNull(insertAt, this.children.length, "number");

      // if items is a single object, make it an array
      if (!Array.isArray(items)) {
        items = [items];
      }

      var r = this._buildDocumentFragment(items);
      this.dom.insertBefore(r.documentFragment, this.dom.childNodes[insertAt]);
      [].splice.apply(this.children, [insertAt, 0].concat(r.children));
    },

    _createLayoutItemWrapper: function(item) {
      var div = document.createElement("div");
      div.className = "layoutItem";

      var cls = Neo.ifNull(item.cls, null, "string,number");
      var size = Neo.ifNull(item.size, null, "string");
      var canRender = Neo.ifNull(item.canRender, true, "boolean");

      if (canRender === false) {
        return null;
      }

      if (cls !== null) {
        div.classList.add(cls);
      }

      if (size !== null) {
        if (this.orient === this.VERTICAL) {
          div.style.height = size;
        } else {
          div.style.width = size;
        }
      }

      return div;
    },

    _buildDocumentFragment: function(items) {
      var documentFragment = document.createDocumentFragment();
      var children = [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var div = this._createLayoutItemWrapper(item);
        var component = Neo.ifNull(item.component, null, "object");

        if (div === null) {
          continue;
        }

        documentFragment.appendChild(div);

        if (component !== null) {
          component.parent = this;
          component.root = this.root;
          component.parentDom = div;
          children.push(Neo.createComponent(component));
        }
      }

      return {
        documentFragment: documentFragment,
        children: children
      };
    },

    removeItems: function(from, length) {
      from = Neo.ifNull(from, new Error("where to begin removing items"), "number");
      length = Neo.ifNull(length, 1, "number");

      var removedComponents = this.children.splice(from, length);

      removedComponents.forEach(function(c) {
        var div = c.dom.parentNode;
        c.remove();
        div.parentNode.removeChild(div);
      });

      return removedComponents;
    },

    empty: function() {
      return this.removeItems(0, this.children.length);
    }
  });
}());