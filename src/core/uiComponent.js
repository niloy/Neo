(function() {
  "use strict";

  Neo.Classes.UIComponent = function(config) {
    Neo.ifNull(config, function() {
      throw new Error("'config' parameter missing");
    }, "object");

    this.dom = null;
    this.listenTo = Neo.ifNull(config.listenTo, {}, "object");
    this.canRender = Neo.ifNull(config.canRender, true, "boolean");
    this.listeners = Neo.ifNull(config.listeners, {}, "object");
    this.cname = Neo.ifNull(config.name, function() {
      throw new Error("component 'name' is required");
    }, "string");
    this.parent = Neo.ifNull(config.parent, null, "UIComponent");
    this.parentDom = Neo.ifNull(config.parentDom, null);
    this.width = Neo.ifNull(config.width, null, "string,number");
    this.height = Neo.ifNull(config.height, null, "string,number");
    this.cls = Neo.ifNull(config.cls, null, "string");
    this.data = Neo.ifNull(config.data, null);
    this.visible = Neo.ifNull(config.visible, true, "boolean");
    this.notification = null;
    this.children = [];
    this.isHighlighting = false;

    if (this.canRender === false) {
      return;
    }

    this.dom = document.createElement("div");
    this.dom._neo = this;

    if (this.cls !== null) {
      this.dom.className = this.cls;
    }

    this.addClass("compUIComponent");
    this.addClass("comp" + this.cname);

    if (this.parent == null) {
      if (this.parentDom == null) {
        throw new Error("both 'parent' and 'parentDom' are missing");
      } else {
        this.parentDom.appendChild(this.dom);
      }
    }

    var returnValueFromBuildDOM = this.buildDOM();

    if (returnValueFromBuildDOM.toString() === "[object Object]") {
      returnValueFromBuildDOM.parent = this;
      var child = Neo.createComponent(returnValueFromBuildDOM);
      this.dom.appendChild(child.dom);
      this.children.push(child);
    } else if (returnValueFromBuildDOM != null) {
      this.dom.appendChild(returnValueFromBuildDOM);
      returnValueFromBuildDOM.classList.add("comp" + this.cname + "Inner");
    }

    if (this.width !== null) {
      this.setWidth(this.width);
    }

    if (this.height !== null) {
      this.setHeight(this.height);
    }

    if (this.visible === false) {
      this.hide();
    }

    for (var eventName in this.listeners) {
      this.dom.addEventListener(eventName, this.listeners[eventName].bind(this));
    }
  };

  Neo.Classes.UIComponent.prototype = {
    HIGHLIGHT_CLASS: "neoHighlight",

    buildDOM: function() {
      throw new Error("'_buildDOM' must be overridden in the sub class");
    },

    show: function() {
      this.dom.style.display = null;
      this.visible = true;
    },

    hide: function() {
      this.dom.style.display = "none";
      this.visible = false;
    },

    isVisible: function() {
      return this.visible;
    },

    isHidden: function() {
      return !this.visible;
    },

    setWidth: function(width) {
      Neo.typeCheck(width, "string,number");
      this.dom.childNodes[0].style.width = width;
    },

    getWidth: function() {
      return parseInt(window.getComputedStyle(this.dom).width, 10);
    },

    setHeight: function(height) {
      Neo.typeCheck(height, "string,number");
      this.dom.childNodes[0].style.height = height;
    },

    getHeight: function() {
      return parseInt(window.getComputedStyle(this.dom).height, 10);
    },

    scrollIntoView: function() {
      this.dom.scrollIntoView();
    },

    setNotification: function(text) {
      Neo.typeCheck(text, "string");

      if (this.notification === null) {
        var span = document.createElement("span");
        span.innerText = text;
        span.className = "neoNotification";
        this.notification = span;
        this.dom.appendChild(span);
      } else {
        this.notification.innerText = text;
      }
    },

    removeNotification: function() {
      if (this.notification !== null) {
        this.dom.removeChild(this.notification);
        this.notification = null;
      }
    },

    startHighlight: function() {
      if (!this.isHighlighting) {
        this.addClass(this.HIGHLIGHT_CLASS);
        this.isHightlighting = true;
      }
    },

    stopHighlight: function() {
      if (this.isHighlighting) {
        this.removeClass(this.HIGHLIGHT_CLASS);
        this.isHighlighting = false;
      }
    },

    addClass: function(str) {
      Neo.typeCheck(str, "string");
      this.dom.classList.add(str);
    },

    removeClass: function(str) {
      Neo.typeCheck(str, "string");
      this.dom.classList.remove(str);
    },

    toggleClass: function(str) {
      Neo.typeCheck(str, "string");
      this.dom.classList.toggle(str);
    },

    remove: function() {}
  };

  function extend(parentClass, properties) {
    if ("extend" in properties) {
      throw new Error("do not use 'extend' as a property, already in use by framework");
    }

    var childClass = function() {
      if ("init" in properties) {
        properties.init.apply(this, arguments);
      }
    };

    childClass.prototype = Object.create(parentClass.prototype);

    for (var property in properties) {
      childClass.prototype[property] = properties[property];
    }

    childClass.extend = extend.bind(null, childClass);

    return childClass;
  }

  Neo.Classes.UIComponent.extend = extend.bind(null, Neo.Classes.UIComponent);
}());