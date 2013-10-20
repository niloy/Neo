(function() {
  "use strict";

  Neo.Classes.Model = function(config) {
    this._attributes = Neo.ifNull(config.attributes, {}, "object");;
    this._listeners = Neo.ifNull(config.listeners, {}, "object");
    this._subscribe = Neo.ifNull(config.subscribe, {}, "object");
    this._validation = Neo.ifNull(config.validation, this.VALIDATION, "function");
    this._eventStore = Neo.ifNull(config.eventStore,
                                  new Error("'eventStore' missing for model"));

    Object.seal(this._attributes);
    this._defineGettersAndSetters();
    this._setupSubscribers();
  };

  Neo.Classes.Model.prototype = {
    VALIDATION: function() {
      return true;
    },

    get valid() {
      return this._validation(this._attributes);
    },

    get attributes() {
      return this._attributes;
    },

    set attributes(value) {
      Neo.typeCheck(value, "object");

      if (this._validation(Neo.extend({}, this._attributes, value))) {
        for (var i in value) {
          this._attributes[i] = value[i];
        }

        this.trigger("change", value);
      } else {
        throw new Error("validation error");
      }
    },

    _defineGettersAndSetters: function() {
      Object.keys(this._attributes).forEach(function(key) {
        Object.defineProperty(this, key, {
          get: function() {
            return this._attributes[key];
          },

          set: function(value) {
            var obj = {};

            obj[key] = value;
            this.attributes = obj;
          }
        });
      }.bind(this));
    },

    trigger: function(event) {
      var args = [].slice.call(arguments, 1);

      if (event in this._listeners) {
        this._listeners[event].apply(null, args);
      }
    },

    _setupSubscribers: function() {
      var self = this;

      for (var s in this._subscribe) {
        this._eventStore.subscribe(s, this._subscribe[s], this);
      }
    },

    publish: function(eventName) {
      var args = [].slice.call(arguments, 1);

      this._eventStore.publish(eventName, args);
    }
  };
}());