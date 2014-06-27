(function() {
  "use strict";

  Neo.KeyCodes = {
    BACKSPACE:  8,
    TAB:        9,
    ENTER:      13,
    SHIFT:      16,
    CONTROL:    17,
    ALT:        18,
    CAPS:       20,
    ESCAPE:     27,
    SPACE:      32,
    PAGEUP:     33,
    PAGEDOWN:   34,
    END:        35,
    HOME:       36,
    LEFT:       37,
    UP:         38,
    RIGHT:      39,
    DOWN:       40,
    DELETE:     46
  };

  Neo.getUniqueNumber = (function() {
    var i = 0;

    return function() {
      return i++;
    };
  }());

  Neo.createComponent = function(config) {
    var componentName = config.name;

    if (!(componentName in Neo.Classes)) {
      throw new Error("Unable to find component -> " + componentName);
    }

    Neo.Metrics.addComponent(config);
    var componentId = "c" + Neo.getUniqueNumber();
    var createdAt = Date.now();
    var renderStartTime = Date.now();
    config.componentId = componentId;

    if (config.debug === true) {
      debugger;
    }

    var component = new Neo.Classes[componentName](config);
    var renderEndTime = Date.now();
    Neo.Metrics.addLog({
      name: config.name,
      createdAt: createdAt,
      renderingTime: renderEndTime - renderStartTime,
      cid: componentId
    });

    return component;
  };

  Neo.ifNull = function(value, defaultValue, typeCheck) {
    if (value == null) {
      if (defaultValue instanceof Error) {
        throw defaultValue;
      } else {
        return defaultValue;
      }
    } else {
      if (typeCheck != null) {
        Neo.typeCheck(value, typeCheck);
      }

      return value;
    }
  };

  Neo.typeCheck = function(value, typeString) {
    var types = typeString.split(",");
    var checkConditions = {
      "string": function(value) {
        return typeof value === "string";
      },
      "number": function(value) {
        return typeof value === "number";
      },
      "function": function(value) {
        return typeof value === "function";
      },
      "array": function(value) {
        return Array.isArray(value);
      },
      "object": function(value) {
        return value != null && value.toString() === "[object Object]";
      },
      "boolean": function(value) {
        return (value === true || value === false);
      },
      "regex": function(value) {
        return value instanceof RegExp;
      },
      "UIComponent": function(value) {
        return value instanceof Neo.Classes.UIComponent;
      },
      "null": function(value) {
        return value === null;
      }
    };

    function isLiteral(value) {
      return value.charAt(0) === "{" && value.charAt(value.length - 1) === "}";
    }

    for (var i = 0; i < types.length; i++) {
      var type = types[i];

      if (isLiteral(type)) {
        // remove the '{' at start and '}' at end, then split on '|'
        var literalParts = type.substr(1, type.length - 2).split("|");

        if (literalParts.indexOf(value) !== -1) {
          return true;
        }
      } else {
        if (!(type in checkConditions)) {
          throw new Error("invalid type -> " + type);
        }

        if (checkConditions[type](value) === true) {
          return true;
        }
      }
    }

    throw new Error("invalid datatype, accepted types are " + typeString);
  };

  Neo.parseQueryString = function() {
    var qs = window.location.search.substr(1);
    var obj = {};

    qs.split("&").forEach(function(part) {
      var parts = part.split("=");
      var key = parts[0];
      var value = parts[1];

      obj[key] = value;
    });

    return obj;
  }


  Neo.getPropByString = function(obj, propString) {
    if(!obj) {
      return undefined;
    }
    if (!propString)
        return obj;

    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];

        var candidate = obj[prop];
        if (candidate !== undefined) {
            obj = candidate;
        } else {
            break;
        }
    }
    return obj[props[i]];
  }


  // http://stackoverflow.com/questions/9399365/deep-extend-like-jquerys-for-nodejs
  Neo.extend = function() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false,
      toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty,
      push = Array.prototype.push,
      slice = Array.prototype.slice,
      trim = String.prototype.trim,
      indexOf = Array.prototype.indexOf,
      class2type = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regexp",
        "[object Object]": "object"
      },
      jQuery = {
        isFunction: function (obj) {
          return jQuery.type(obj) === "function"
        },
        isArray: Array.isArray ||
        function (obj) {
          return jQuery.type(obj) === "array"
        },
        isWindow: function (obj) {
          return obj != null && obj == obj.window
        },
        isNumeric: function (obj) {
          return !isNaN(parseFloat(obj)) && isFinite(obj)
        },
        type: function (obj) {
          return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
        },
        isPlainObject: function (obj) {
          if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
            return false
          }
          try {
            if (obj.constructor && !hasOwn.call(obj, "constructor") &&
              !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
              return false
            }
          } catch (e) {
            return false
          }
          var key;
          for (key in obj) {}
          return key === undefined || hasOwn.call(obj, key)
        }
      };
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {}
    }
    if (length === i) {
      target = this;
      --i;
    }
    for (i; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue
          }
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : []
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            // WARNING: RECURSION
            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };

  Neo.emptyNode = function(e) {
    while (e.childNodes.length > 0) e.removeChild(e.firstChild);
  };

  Neo.registerClass = function(className, parentClassName, properties) {
    Neo.Classes[className] = Neo.Classes[parentClassName].extend(properties);
  };

  Array.from = function(arrayish) {
    return [].slice.call(arrayish);
  };

  Neo.a2o = function(array, fn) {
    fn = fn || function(e) {
      return {left: e, right: e};
    };
    var o = {};

    array.forEach(function(a) {
      var b = fn(a);
      o[b.left] = b.right;
    });

    return o;
  };

  Neo.decodeHtml = function(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent;
  };

  //http://stackoverflow.com/questions/2234979/
  Neo.isDescendant = function(parent, child) {
    var node = child.parentNode;

    while (node != null) {
      if (node == parent) {
         return true;
      }
      node = node.parentNode;
    }

    return false;
  };
}());