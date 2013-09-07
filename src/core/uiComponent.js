(function() {
  "use strict";

  Neo.Classes.UIComponent = function(config) {
    Neo.ifNull(config, new Error("'config' parameter missing"), "object");

    this.dom = null;
    this.listenTo = Neo.ifNull(config.listenTo, {}, "object");
    this._canRender = Neo.ifNull(config.canRender, true, "boolean");
    this.listeners = Neo.ifNull(config.listeners, {}, "object");
    this.cname = Neo.ifNull(config.name, new Error("'name' is required"), "string");
    this.parent = Neo.ifNull(config.parent, null);
    this.parentDom = Neo.ifNull(config.parentDom, null);
    this._width = Neo.ifNull(config.width, null, "string,number");
    this._height = Neo.ifNull(config.height, null, "string,number");
    this.cls = Neo.ifNull(config.cls, null, "string");
    this.data = Neo.ifNull(config.data, null);
    this._visible = Neo.ifNull(config.visible, true, "boolean");
    this._notification = null;
    this.children = [];
    this.isHighlighting = false;
    this.subscribe = Neo.ifNull(config.subscribe, {}, "object");
    this.subscribeRegistry = {};
    this.root = Neo.ifNull(config.root, null);

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

    if (this.parent == null && this.parentDom == null) {
      throw new Error("both 'parent' and 'parentDom' are missing");
    }

    if (this.parent == null) {
      this.root = this;
    }

    if (this.parentDom !== null) {
      this.parentDom.appendChild(this.dom);
    }

    var returnValueFromBuildDOM = this.buildDOM();

    if (returnValueFromBuildDOM != null) {
      if (returnValueFromBuildDOM.toString() === "[object Object]") {
        returnValueFromBuildDOM.parent = this;
        returnValueFromBuildDOM.root = this.root;
        var child = Neo.createComponent(returnValueFromBuildDOM);
        this.dom.appendChild(child.dom);
        this.children.push(child);
      } else {
        this.dom.appendChild(returnValueFromBuildDOM);
        returnValueFromBuildDOM.classList.add("comp" + this.cname + "Inner");
      }
    }

    if (this._width !== null) {
      this.width = this._width;
    }

    if (this._height !== null) {
      this.height = this._height;
    }

    if (this._visible === false) {
      this.visible = false;
    }

    for (var eventName in this.listeners) {
      this.dom.addEventListener(eventName, this.listeners[eventName].bind(this));
    }

    this._setupSubscribers();
  };

  Neo.Classes.UIComponent.prototype = {
    HIGHLIGHT_CLASS: "neoHighlight",

    buildDOM: function() {
      throw new Error("'_buildDOM' must be overridden in the sub class");
    },

    get visible() {
      return this._visible;
    },

    set visible(flag) {
      Neo.typeCheck(flag, "boolean");

      if (flag === true) {
        this.dom.style.display = null;
        this._visible = true;
      } else {
        this.dom.style.display = "none";
        this._visible = false;
      }
    },

    get width() {
      return window.getComputedStyle(this.dom).width;
    },

    set width(value) {
      Neo.typeCheck(value, "string");
      this.dom.childNodes[0].style.width = value;
    },

    get height() {
      return window.getComputedStyle(this.dom).height;
    },

    set height(value) {
      Neo.typeCheck(value, "string");
      this.dom.childNodes[0].style.height = value;
    },

    scrollIntoView: function() {
      this.dom.scrollIntoView();
    },

    set notification(value) {
      Neo.typeCheck(value, "string");

      if (this._notification === null) {
        var span = document.createElement("span");
        span.textContent = value;
        span.className = "neoNotification";
        this._notification = span;
        this.dom.appendChild(span);
      } else {
        this._notification.textContent = value;
      }
    },

    get notification() {
      if (this._notification !== null) {
        return this._notification.textContent;
      } else {
        return null;
      }
    },

    removeNotification: function() {
      if (this._notification !== null) {
        this.dom.removeChild(this._notification);
        this._notification = null;
      }
    },

    get highlight() {
      return this.isHighlighting;
    },

    set highlight(value) {
      Neo.typeCheck(value, "boolean");

      if (value === true && this.isHighlighting === false) {
        this.addClass(this.HIGHLIGHT_CLASS);
        this.isHighlighting = true;
      } else if (value === false && this.isHighlighting === true) {
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

    remove: function() {
      this.children.forEach(function(child) {
        child.remove();
      });
      this.dom.parentNode.removeChild(this.dom);
    },

    publish: function(eventName) {
      var args = [].slice.call(arguments, 1);

      if (eventName in this.root.subscribeRegistry) {
        this.root.subscribeRegistry[eventName].forEach(function(eObj) {
          eObj.raise(eventName, this, args);
        }.bind(this));
      }
    },

    _setupSubscribers: function() {
      var self = this;

      for (var s in this.subscribe) {
        var eventPro = new Neo.Classes.EventProcessor({
          eventString: s,
          eventHandler: this.subscribe[s],
          deleteCallback: function() {
            eventPro.eventNames.forEach(function(event) {
              var index = self.root.subscribeRegistry[event].indexOf(eventPro);
              delete self.root.subscribeRegistry[event][index];
            });
          }
        });

        eventPro.eventNames.forEach(function(event) {
          if (!(event in self.root.subscribeRegistry)) {
            self.root.subscribeRegistry[event] = [];
          }

          self.root.subscribeRegistry[event].push(eventPro);
        });
      }
    }
  };

  // http://ejohn.org/blog/javascript-getters-and-setters/
  function copy(a,b) {
    for ( var i in b ) {
        var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);

        if ( g || s ) {
            if ( g )
                a.__defineGetter__(i, g);
            if ( s )
                a.__defineSetter__(i, s);
         } else
             a[i] = b[i];
    }
    return a;
  }

  function extend(parentClass, properties) {
    if ("extend" in properties) {
      throw new Error("do not use 'extend' as a property, already in use by framework");
    }

    function childClass() {
      if ("init" in properties) {
        properties.init.apply(this, arguments);
      }
    };

    childClass.prototype = Object.create(parentClass.prototype);

    copy(childClass.prototype, properties);

    childClass.extend = extend.bind(null, childClass);

    return childClass;
  }

  Neo.Classes.UIComponent.extend = extend.bind(null, Neo.Classes.UIComponent);
}());