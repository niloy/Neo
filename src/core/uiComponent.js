"use strict";

var utils = require("./utils.js");
var EventStore = require("./eventStore.js");
var metrics = require("./metric.js");
var ifNull = utils.ifNull;

var CLASS_PREFIX = "neo";

function UIComponent(config) {
  ifNull(config, new Error("'config' parameter missing"), "object");
  ifNull(config.parent, new Error("'parent' missing'"), "object,string");

  this.dom = null;
  this.listenTo = ifNull(config.listenTo, {}, "object");
  this._canRender = ifNull(config.canRender, true, "boolean");
  this.listeners = ifNull(config.listeners, {}, "object");
  this.cname = ifNull(config.name, new Error("'name' is required"), "string");
  this.parent = ifNull(config.parent, null);
  this.parentDom = ifNull(config.parentDom, null);
  this._width = ifNull(config.width, null, "string,number");
  this._height = ifNull(config.height, null, "string,number");
  this.cls = ifNull(config.cls, null, "string");
  this.custom = ifNull(config.custom, {});
  this._visible = ifNull(config.visible, true, "boolean");
  this._notification = null;
  this.children = [];
  this.isHighlighting = false;
  this.hightlightDom = null;
  this.subscribe = ifNull(config.subscribe, {}, "object");
  this.eventStore = new EventStore(this);
  this.eventRoot = ifNull(config.eventRoot, this.parent.eventRoot);
  this.models = [];
  this._uiBlocked = false;
  this._uiBlockMask = null;
  this._componentId = ifNull(config.componentId, null, "string");
  this._tooltip = ifNull(config.tooltip, null, "object,string");
  this.tooltip = null;
  this.style = ifNull(config.style, {}, "object");
  this._hint = null;
  this._externalListeners = [];
  this._disabled = ifNull(config.disabled, false, "boolean");
  this.embedded = ifNull(config.embedded, true, "boolean");
  this.tid = ifNull(config.tid, null, "string,number");

  if (this._canRender === false) {
    return;
  }

  if (this.eventRoot === "APPLICATION_ROOT") {
    this.eventRoot = this.eventStore;
  }

  this.dom = document.createElement("section");
  this.dom._neo = this;

  if (this.tid !== null) {
    this.dom.dataset.tid = "t" + this.tid;
  }

  if (this.cls !== null) {
    this.dom.className = this.cls;
  }

  if (this._componentId) {
    this.dom.dataset.cid = this._componentId;
  }

  this.addClass(CLASS_PREFIX + this.cname);

  if (this.parent === "APPLICATION_ROOT" && this.parentDom == null) {
    throw new Error("'parentDom' is missing");
  }

  if (this.parentDom !== null) {
    this.parentDom.appendChild(this.dom);
  }

  var returnValueFromBuildDOM = this.buildDOM();

  if (returnValueFromBuildDOM != null) {
    if (returnValueFromBuildDOM.toString() === "[object Object]") {
      returnValueFromBuildDOM.parent = this;
      returnValueFromBuildDOM.eventRoot = this.eventStore;
      var child = this.appendComponent(returnValueFromBuildDOM);
      this.dom.appendChild(child.dom);
      this.children.push(child);
    } else {
      this.dom.appendChild(returnValueFromBuildDOM);
      returnValueFromBuildDOM.classList.add(CLASS_PREFIX + this.cname + "Inner");
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

  if (this._tooltip !== null) {
    this.tooltip = utils.createComponent({
      name: "Tooltip",
      component: this._tooltip,
      parent: this
    });
  }

  for (var s in this.style) {
    this.dom.style.setProperty(s, this.style[s]);
  }

  this._setupListeners();

  this._setupSubscribers();

  if (this._disabled === true) {
    this.disabled = true;
  }
};

UIComponent.prototype = {
  HIGHLIGHT_CLASS: "neoHighlight",

  buildDOM: function() {},

  get visible() {
    return this._visible;
  },

  set visible(flag) {
    utils.typeCheck(flag, "boolean");

    if (flag === true) {
      this.dom.style.display = "";
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
    utils.typeCheck(value, "string");
    this.dom.style.width = value;
  },

  get height() {
    return window.getComputedStyle(this.dom).height;
  },

  set height(value) {
    utils.typeCheck(value, "string");
    this.dom.style.height = value;
  },

  scrollIntoView: function(alignWithTop) {
    this.dom.scrollIntoView(alignWithTop);
  },

  set notification(value) {
    utils.typeCheck(value, "string,number,null");

    if (value === null) {
      this._removeNotification();
    } else {
      if (this._notification === null) {
        var span = document.createElement("span");
        span.textContent = value;
        span.className = "neoNotification";
        this._notification = span;
        this.dom.appendChild(span);
      } else {
        this._notification.textContent = value;
      }
    }
  },

  get notification() {
    if (this._notification !== null) {
      return this._notification.textContent;
    } else {
      return null;
    }
  },

  _removeNotification: function() {
    if (this._notification !== null) {
      this.dom.removeChild(this._notification);
      this._notification = null;
    }
  },

  get highlight() {
    return this.isHighlighting;
  },

  set highlight(value) {
    utils.typeCheck(value, "boolean");

    if (value === true && this.isHighlighting === false) {
      this._hightlight();
      this.isHighlighting = true;
    } else if (value === false && this.isHighlighting === true) {
      this._removeHightlight();
      this.isHighlighting = false;
    }
  },

  _hightlight: function() {
    var SVG_WIDTH = 70;
    var SVG_HEIGHT = 70;
    var SVG = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "neoHighlight");
    this.hightlightDom = svg;

    var xfactor = (parseInt(this.width, 10) / SVG_WIDTH) * 1.1;
    var yfactor = (parseInt(this.height, 10) / SVG_HEIGHT) * 1.1;
    var styleStr = "scaleX(" + xfactor + ") scaleY(" + yfactor + ")";
    svg.style.webkitTransform = styleStr;
    svg.style.transform = styleStr;

    var circlePath = "M34.745,7.183C25.078,12.703,13.516,26.359,8.797,37.13 c\
-13.652,31.134,9.219,54.785,34.77,55.99c15.826,0.742,31.804-2.607,42.207-17.52c\
6.641-9.52,12.918-27.789,7.396-39.713 C85.873,20.155,69.828-5.347,41.802,13.379";
    var path = document.createElementNS(SVG, "path");
    path.setAttribute("d", circlePath);
    path.setAttribute("class", "path");

    svg.appendChild(path);
    this.dom.appendChild(svg);
    path.getBoundingClientRect();
    path.style.strokeDashoffset = "0";
  },

  _removeHightlight: function() {
    this.dom.removeChild(this.hightlightDom);
  },

  addClass: function(str) {
    utils.typeCheck(str, "string");
    this.dom.classList.add(str);
  },

  removeClass: function(str) {
    utils.typeCheck(str, "string");
    this.dom.classList.remove(str);
  },

  toggleClass: function(str) {
    utils.typeCheck(str, "string");
    this.dom.classList.toggle(str);
  },

  hasClass: function(str) {
    utils.typeCheck(str, "string");
    return this.dom.classList.contains(str);
  },

  remove: function() {
    this._externalListeners.forEach(function(item) {
      item.element.removeEventListener(item.eventName, item.listener);
    }.bind(this));
    this.children.forEach(function(child) {
      child.remove();
    });
    this.dom.parentNode.removeChild(this.dom);
  },

  publish: function(eventName) {
    var args = [].slice.call(arguments, 1);

    metrics.addEventLog({
      source: this._componentId,
      timestamp: Date.now(),
      event: eventName,
      args: JSON.stringify(args)
    });

    return this.eventRoot.publish(eventName, args);
  },

  publishWithin: function(eventName) {
    var args = [].slice.call(arguments, 1);

    metrics.addEventLog({
      source: this._componentId,
      timestamp: Date.now(),
      event: eventName,
      args: JSON.stringify(args)
    });

    return this.eventStore.publish(eventName, args);
  },

  _setupSubscribers: function() {
    var self = this;

    for (var s in this.subscribe) {
      this.eventRoot.subscribe(s, this.subscribe[s], this);
    }
  },

  registerModel: function(config) {
    config.eventStore = this.eventStore;
    var model = new Neo.Classes.Model(config);
    this.models.push(model);
  },

  trigger: function(eventName, args) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    event.detail = args;
    this.dom.dispatchEvent(event);
  },

  get blockUI() {
    return this._uiBlocked;
  },

  set blockUI(value) {
    Neo.typeCheck(value, "boolean");
    var eventBlackList = ["click", "keyup", "keydown", "keypress", "mouseover"];

    if (value === true && !this._uiBlocked) {
      var mask = document.createElement("div");
      mask.className = "uiBlockMask";
      mask.tabIndex = "-1";
      mask.focus();
      eventBlackList.forEach(function(event) {
        mask.addEventListener(event, function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      this.dom.appendChild(mask);
      this._uiBlockMask = mask;
      this._uiBlocked = true;
    } else if (value === false && this._uiBlocked) {
      this.dom.removeChild(this._uiBlockMask);
      this._uiBlockMask = null;
      this._uiBlocked = false;
    }
  },

  createDialog: function(config) {
    config.name = "Dialog";
    config.parentDom = this.dom;
    config.parent = this;
    config.root = this;
    config.eventRoot = this.eventStore;
    return Neo.createComponent(config);
  },

  alert: function(config) {
    Neo.typeCheck(config, "string,object");

    var DEFAULT_TITLE = "Application";
    var text, title, callback;

    if (typeof config === "string") {
      text = config;
      title = DEFAULT_TITLE;
    } else {
      text = ifNull(config.text, new Error("Alert 'text' missing"), "string");
      title = ifNull(config.title, DEFAULT_TITLE, "string");
      callback = ifNull(config.callback, function() {}, "function");
    }

    var dialog = this.createDialog({
      name: "Dialog",
      cls: "neoAlert",
      title: title,
      body: {
        name: "Layout",
        items: [{
          layoutCls: "neoAlertText",
          name: "Label",
          text: text
        }, {
          layoutCls: "neoAlertOk",
          name: "Button",
          text: "OK",
          listeners: {
            click: function() {
              dialog.close();
              dialog.remove();
            }
          }
        }]
      },
      afterClose: callback
    });

    dialog.open();
  },

  confirm: function(config) {
    Neo.typeCheck(config, "string,object");

    var DEFAULT_TITLE = "Application";
    var text, title, callback, afterCloseCb;

    if (typeof config === "string") {
      text = config;
      title = DEFAULT_TITLE;
    } else {
      text = ifNull(config.text, new Error("Confirm 'text' missing"), "string");
      title = ifNull(config.title, DEFAULT_TITLE, "string");
      afterCloseCb = ifNull(config.afterCloseCb, function() {}, "function");
      callback = ifNull(config.callback, function() {}, "function");
    }

    var dialog = this.createDialog({
      name: "Dialog",
      cls: "neoConfirm",
      title: title,
      body: {
        name: "Layout",
        items: [{
          layoutCls: "neoConfirmText",
          name: "Label",
          text: text
        }, {
          name: "Layout",
          cls: "buttonHolder",
          orient: "horizontal",
          items: [{
            layoutCls: "neoConfirmOk",
            name: "Button",
            text: "OK",
            listeners: {
              click: function() {
                callback(true);
                dialog.close();
                dialog.remove();
              }
            }
          }, {
            layoutCls: "neoConfirmCancel",
            name: "Button",
            text: "Cancel",
            listeners: {
              click: function() {
                callback(false);
                dialog.close();
                dialog.remove();
              }
            }
          }]
        }]
      },
      afterClose: afterCloseCb
    });
    dialog.open();
  },

  showTooltip: function(callback) {
    this.tooltip.show(callback);
  },

  hideTooltip: function(callback) {
    this.tooltip.hide(callback);
  },

  set hint(value) {
    Neo.typeCheck(value, "string,object,null");

    var removeHint = function() {
      if (this._hint !== null) {
        this._hint.remove();
        this._hint = null;
      }
    }.bind(this);

    if (value === null) {
      removeHint();
    } else {
      removeHint();
      this._hint = Neo.createComponent({
        name: "Tooltip",
        component: value,
        parent: this,
        autoShowHide: false
      });
      this._hint.show();
    }
  },

  appendComponent: function(config) {
    config.parentDom = ifNull(config.parentDom, this.dom);
    config.parent = this;
    config.eventRoot = this.eventStore;

    var componentName = config.name;

    metrics.addComponent(config);
    var componentId = "c" + utils.getUniqueNumber();
    var createdAt = Date.now();
    var renderStartTime = Date.now();
    config.componentId = componentId;

    if (config.debug === true) {
      debugger;
    }

    var Constructor = utils.getComponentConstructor(componentName);
    var component = new Constructor(config);
    var renderEndTime = Date.now();
    metrics.addLog({
      name: config.name,
      createdAt: createdAt,
      renderingTime: renderEndTime - renderStartTime,
      cid: componentId
    });

    return component;
  },

  getKeyValuePairs: function() {
    var values = [];

    this.children.forEach(function(child) {
      values = values.concat(child.getKeyValuePairs());
    }.bind(this));

    return values;
  },

  get values() {
    var values = this.getKeyValuePairs();
    var map = {};

    values.forEach(function(value) {
      if (value.key !== null) {
        map[value.key] = value.value;
      }
    }.bind(this));

    return map;
  },

  attachExternalListener: function(element, eventName, listener) {
    this._externalListeners.push({
      element: element,
      eventName: eventName,
      listener: listener
    });

    element.addEventListener(eventName, listener);
  },

  get disabled() {
    return this._disabled;
  },

  set disabled(value) {
    Neo.typeCheck(value, "boolean");

    if (value) {
      this.addClass("disabled");
      this._disabled = true;
    } else {
      this.removeClass("disabled");
      this._disabled = false;
    }
  },

  get valid() {
    for (var i = 0; i < this.children.length; i++) {
      var v = this.children[i].valid;

      if (v === false) {
        return false;
      }
    }

    return true;
  },

  set valid(value) {
    throw new Error("'valid' cannot be used as a setter");
  },

  _setupListeners: function() {
    for (var eventName in this.listeners) {
      this.dom.addEventListener(eventName, function(eventName, e) {
        if (!this._disabled) {
          this.listeners[eventName].call(this, e);
        }
      }.bind(this, eventName));
    }
  }
};

module.exports = UIComponent;
