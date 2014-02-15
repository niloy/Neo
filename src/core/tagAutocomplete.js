(function() {
  "use strict";

  var OPTION_HIGHLIGHT = "highlighted";

  Neo.Classes.TagAutocomplete = Neo.Classes.Input.extend({
    init: function(config) {
      this.tags = [];
      this.textbox = null;
      this.optionContainer = null;
      this.typingTimer = null;
      this.highlightIndex = -1;
      this._options = {};
      this.initialValue = Neo.ifNull(config.value, null, "object");

      Neo.Classes.Input.call(this, config);

      this.attachExternalListener(document.body, "click", function() {
        this.hideOptions();
      }.bind(this));

      if (this.initialValue !== null) {
        this.value = this.initialValue;
      }
    },

    buildDOM: function() {
      var self = this;

      var textbox = document.createElement("input");
      textbox.type = "text";
      textbox.className = "textbox";
      this.dom.appendChild(textbox);
      this.textbox = textbox;
      textbox.addEventListener("keydown", this._handleKeyPress.bind(this));

      var optionContainer = document.createElement("div");
      optionContainer.className = "optionContainer";
      optionContainer.style.maxHeight = Math.floor(innerHeight / 2) + "px";
      this.dom.appendChild(optionContainer);
      this.optionContainer = optionContainer;
    },

    insertTag: function(value, text) {
      if (!this._isUnique(value)) {
        return;
      }

      var tag = this._createTag(text, value);
      this.dom.insertBefore(tag, this.textbox);
      this.tags.push({
        value: value,
        text: text,
        el: tag
      });
      this._adjustTextboxWidth();
      this.textbox.value = "";
      this.textbox.focus();
      this.trigger("tagInserted", {value: value, text: text});
    },

    removeTag: function(value) {
      this.tags = this.tags.filter(function(t) {
        if (t.value === value) {
          t.el.parentNode.removeChild(t.el);
          return false;
        } else {
          return true;
        }
      });

      this._adjustTextboxWidth();
      this.textbox.focus();
    },

    _createTag: function(text, value) {
      var tagHolder = document.createElement("div");
      tagHolder.className = "tagHolder";

      var tag = document.createElement("div");
      tag.className = "tag";
      tagHolder.appendChild(tag);

      var textEl = document.createElement("div");
      textEl.textContent = text;
      textEl.className = "text";
      tag.appendChild(textEl);

      var close = document.createElement("div");
      close.textContent = "x";
      close.className = "close";
      tag.appendChild(close);
      close.addEventListener("click", function() {
        this.removeTag(value);
      }.bind(this));

      return tagHolder;
    },

    _adjustTextboxWidth: function() {
      var tagEdge;

      if (this.tags.length > 0) {
        var lastTagEl = this.tags[this.tags.length - 1].el;
        tagEdge = lastTagEl.offsetLeft + lastTagEl.offsetWidth;
      } else {
        tagEdge = 0;
      }

      var width = Math.max(40, this.dom.offsetWidth - tagEdge - 10);
      this.textbox.style.width = width + "px";
    },

    get options() {
      return this._options;
    },

    set options(options) {
      Neo.typeCheck(options, "object");

      this._options = options;
      this.hideLoader();
      this.currentOptionHighlight = -1;
      Neo.emptyNode(this.optionContainer);

      for (var i in options) {
        var opt = document.createElement("div");
        opt.className = "option";
        opt.textContent = options[i];
        opt.dataset.value = i;
        opt.dataset.text = options[i];
        this.optionContainer.appendChild(opt);
        opt.addEventListener("click", function(value, text) {
          this.insertTag(value, text);
        }.bind(this, i, options[i]));
      }

      if (Object.keys(options).length > 0) {
        this.showOptions();
      }
    },

    showLoader: function() {
      this.addClass("loading");
    },

    hideLoader: function() {
      this.removeClass("loading");
    },

    showOptions: function() {
      this.optionContainer.style.display = "block";
    },

    hideOptions: function() {
      this.optionContainer.style.display = "";
      this.highlightIndex = -1;
    },

    moveSelectionDown: function() {
      if (this.highlightIndex < this.optionContainer.childNodes.length - 1) {
        this.setOptionHightlight(this.highlightIndex + 1);
      }
    },

    moveSelectionUp: function() {
      if (this.highlightIndex > 0) {
        this.setOptionHightlight(this.highlightIndex - 1);
      }
    },

    setOptionHightlight: function(index) {
      if (this.highlightIndex !== -1) {
        this.optionContainer.childNodes[this.highlightIndex].classList
          .remove(OPTION_HIGHLIGHT);
      }

      this.optionContainer.childNodes[index].classList.add(OPTION_HIGHLIGHT);
      this.highlightIndex = index;
    },

    _isUnique: function(value) {
      var t = this.tags.filter(function(t) {
        return t.value === value;
      });

      return t.length === 0;
    },

    _handleKeyPress: function(e) {
      if (e.keyCode === Neo.KeyCodes.BACKSPACE && this.textbox.value === "") {
        if (this.tags.length > 0) {
          var lastTag = this.tags[this.tags.length - 1];
          this.removeTag(lastTag.value);
        }
      } else if (e.keyCode === Neo.KeyCodes.ENTER) {
        e.preventDefault();

        if (this.highlightIndex !== -1) {
          var tag = this.optionContainer.childNodes[this.highlightIndex];
          this.insertTag(tag.dataset.value, tag.dataset.text);
          this.hideOptions();
          this.highlightIndex = -1;
        }
      } else if (e.keyCode === Neo.KeyCodes.UP) {
        e.preventDefault();
        this.moveSelectionUp();
      } else if (e.keyCode === Neo.KeyCodes.DOWN) {
        e.preventDefault();
        this.moveSelectionDown();
      } else if (e.keyCode === Neo.KeyCodes.ESCAPE) {
        this.hideOptions();
      } else {
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(function() {
          if (this.textbox.value === "") {
            this.hideOptions();
          } else {
            this.trigger("optionsRequested", this.textbox.value);
            this.showLoader();
          }
        }.bind(this), 500);
      }
    },

    get value() {
      return this.tags.map(function(t) {
        return t.value;
      });
    },

    set value(value) {
      Neo.typeCheck(value, "object");

      for (var i in value) {
        this.insertTag(i, value[i]);
      }
    },

    focus: function() {
      this.textbox.focus();
    }
  });
}());
