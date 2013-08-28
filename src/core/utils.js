(function() {
  "use strict";

  Neo.viewContainer = document.getElementById("viewContainer");

  Neo.KeyCodes = {
    ENTER: 13
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

    return new Neo.Classes[componentName](config);
  };

  Neo.ifNull = function(value, defaultValue, typeCheck) {
    if (value == null) {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
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
        return value.toString() === "[object Object]";
      },
      "boolean": function(value) {
        return (value === true || value === false);
      },
      "regex": function(value) {
        return value instanceof RegExp;
      },
      "UIComponent": function(value) {
        return value instanceof Neo.Classes.UIComponent;
      }
    };

    function isLiteral(value) {
      return value.charAt(0) === "{" && value.charAt(value.length - 1) === "}";
    }

    for (var i = 0; i < types.length; i++) {
      var type = types[i];

      if (isLiteral(type)) {
        // remove the '{' at start and '}' at end, then split on ':'
        var literalParts = type.substr(1, type.length - 2).split(":");

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
}());