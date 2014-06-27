(function() {
  "use strict";

  Neo.Classes.Table = Neo.Classes.UIComponent.extend({
    TABLE_HEADING_CLASS: "tableHeading",
    TABLE_ROWS_CLASS: "tableRows",
    HEADING_ITEM_CLASS: "headerItem",
    ROW_ITEM_CLASS: "rowItem",
    COLUMN_ITEM_CLASS: "colItem",

    init: function(config) {
      var he = new Error("'headers' missing");

      this._data = null;
      this.columns = Neo.ifNull(config.columns, he, "object");
      this.headerKeys = Object.keys(this.columns);
      this.headerLayout = null;
      this.rowsLayout = null;
      this.fixedWidth = false;
      this.rowWidth = 0;

      Neo.Classes.UIComponent.call(this, config);

      this.data = Neo.ifNull(config.data, [], "array");
    },

    buildDOM: function() {
      this._determineWidth();
      this.headerLayout = this._createHeader();
      this.rowsLayout = this.appendComponent({
        name: "Layout",
        style: {
          "max-height": (window.innerHeight - 100) + "px"
        },
        cls: this.TABLE_ROWS_CLASS,
        listeners: {
          scroll: function() {
            var scrollLeft = this.rowsLayout.dom.scrollLeft;
            this.headerLayout.dom.firstChild.style.marginLeft = "-" + scrollLeft + "px";
          }.bind(this)
        }
      });
    },

    _createHeader: function() {
      var headerItems = this.headerKeys.map(function(key) {
        return {
          layoutCls: this.HEADING_ITEM_CLASS,
          layoutSize: this.columns[key].width,
          name: "Label",
          text: this.columns[key].title || key
        }
      }.bind(this));

      return this.appendComponent({
        name: "Layout",
        width: this.fixedWidth ? this.rowWidth : null,
        orient: "horizontal",
        cls: this.TABLE_HEADING_CLASS,
        items: headerItems
      });
    },

    get data() {
      return this._data;
    },

    set data(value) {
      Neo.typeCheck(value, "array");

      this._data = value;
      this.rowsLayout.empty();

      var layoutItems = value.map(function(row, index) {
        var rowItems = this.headerKeys.map(function(col) {
          var formatter = Neo.ifNull(this.columns[col].formatter,
            this._defaultFormatter, "function");

          var returnFromFormatter = formatter({
            column: col,
            row: row,
            value: row[col]
          });

          return Neo.extend({
            layoutCls: this.COLUMN_ITEM_CLASS,
            layoutSize: this.columns[col].width,
          }, returnFromFormatter);

        }.bind(this));

        return {
          layoutCls: this.ROW_ITEM_CLASS,
          name: "Layout",
          width: this.fixedWidth ? this.rowWidth : null,
          orient: "horizontal",
          items: rowItems

        };
      }.bind(this));

      this.rowsLayout.insertItems(layoutItems);
    },

    _defaultFormatter: function(args) {
      return {
        name: "Label",
        text: args.value
      };
    },

    _determineWidth: function() {
      var totalWidth = 0;

      for (var i in this.columns) {
        var width = this.columns[i].width;

        if (width && width.substr(-2) === "px") {
          totalWidth += parseInt(width, 10);
        } else {
          return;
        }
      }

      this.fixedWidth = true;
      this.rowWidth = totalWidth + "px";
    },

    set body(value) {
      Neo.typeCheck(value, "string,object");

      var component;

      if (typeof value === "string") {
        component = {
          name: "Label",
          text: value
        };
      } else {
        component = value;
      }

      this.rowsLayout.empty();
      this.rowsLayout.insertItems(component);
    }
  });
}());