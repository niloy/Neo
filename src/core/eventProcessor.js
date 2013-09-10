(function() {
  "use strict";

  Neo.Classes.EventProcessor = function(config) {
    Neo.typeCheck(config.eventString, "string");
    Neo.typeCheck(config.eventHandler, "function");
    Neo.typeCheck(config.deleteCallback, "function");

    this.context = config.context;
    this.eventString = config.eventString;
    this.eventHandler = config.eventHandler;
    this.deleteCallback = config.deleteCallback;
    this.type = this._detectType();
    this.eventNames = this._parseEventNames();
    this.eventMap = {};

    this.eventNames.forEach(function(eventName) {
      this.eventMap[eventName] = false;
    }.bind(this));
  }

  Neo.Classes.EventProcessor.prototype = {
    SIMPLE: "SIMPLE",
    ONCE: "ONCE",
    AND: "AND",
    OR: "OR",

    raise: function(eventName, data) {
      switch (this.type) {
        case this.SIMPLE:
        case this.OR:
          this.eventHandler.apply(this.context, data);
          break;
        case this.ONCE:
          this.deleteCallback();
          this.eventHandler.apply(this.context, data);
          break;
        case this.AND:
          this.eventMap[eventName] = true;

          var allAndEventsRaised = true;
          for (var i in this.eventMap) {
            if (this.eventMap[i] === false) {
              allAndEventsRaised = false;
              break;
            }
          }

          if (allAndEventsRaised) {
            for (var j in this.eventMap) {
              this.eventMap[j] = false;
            }

            this.eventHandler.apply(this.context, data);
          }
          break;
      }
    },

    _detectType: function() {
      if (this.eventString.substr(0, 5) === "ONCE ") {
        return this.ONCE;
      } else if (/\bAND\b/.test(this.eventString)) {
        return this.AND;
      } else if (/\bOR\b/.test(this.eventString)) {
        return this.OR;
      } else {
        return this.SIMPLE;
      }
    },

    _parseEventNames: function() {
      function trim(str) {
        return str.trim();
      }

      switch (this.type) {
        case this.ONCE:
          return [this.eventString.substr(5)];
          break;
        case this.AND:
          return this.eventString.split(/\bAND\b/).map(trim);
          break;
        case this.OR:
          return this.eventString.split(/\bOR\b/).map(trim);
          break;
        case this.SIMPLE:
          return [this.eventString];
          break;
      }
    }
  };
}());