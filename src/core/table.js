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
      this.header = Neo.ifNull(config.header, he, "object");
      this.headerKeys = Object.keys(this.header);
      this.headerLayout = null;
      this.rowsLayout = null;
      this.fixedWidth = false;
      this.rowWidth = 0;

      Neo.Classes.UIComponent.call(this, config);

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

      this.data = Neo.ifNull(config.data, [], "array");
    },

    _createHeader: function() {
      var headerItems = this.headerKeys.map(function(key) {
        return {
          cls: this.HEADING_ITEM_CLASS,
          size: this.header[key].width,
          component: {
            name: "Label",
            text: this.header[key].title || key
          }
        };
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
          return {
            cls: this.COLUMN_ITEM_CLASS,
            size: this.header[col].width,
            component: {
              name: "Label",
              text: row[col]
            }
          };
        }.bind(this));

        return {
          cls: this.ROW_ITEM_CLASS,
          component: {
            name: "Layout",
            width: this.fixedWidth ? this.rowWidth : null,
            orient: "horizontal",
            items: rowItems
          }
        };
      }.bind(this));

      this.rowsLayout.insertItems(layoutItems);
    },

    _determineWidth: function() {
      var totalWidth = 0;

      for (var i in this.header) {
        var width = this.header[i].width;

        if (width && width.substr(-2) === "px") {
          totalWidth += parseInt(width, 10);
        } else {
          return;
        }
      }

      this.fixedWidth = true;
      this.rowWidth = totalWidth + "px";
    }
  });
}());