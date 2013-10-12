(function() {
  "use strict";

  Neo.Classes.Tab = Neo.Classes.UIComponent.extend({
    UNTITLED: "untitled",
    ACTIVE: "active",

    init: function(config) {
      this._tabConfig = Neo.ifNull(config.tabs, {}, "object");
      this.tabHeader = null;
      this.tabBody = null;
      this._activeTabId = null;
      this.tabs = {};

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var tabHeader = document.createElement("div");
      tabHeader.className = "tabHeader";
      this.dom.appendChild(tabHeader);
      this.tabHeader = tabHeader;

      var tabBody = document.createElement("div");
      tabBody.className = "tabBody";
      this.dom.appendChild(tabBody);
      this.tabBody = tabBody;

      Object.keys(this._tabConfig).forEach(function(key) {
        var config = this._tabConfig[key];
        config.title = Neo.ifNull(config.title, key, "string");
        config.id = key;
        this.insertTab(config);
      }.bind(this));

      // If no active tab was passed in config, make the first tab active
      if (this._activeTabId === null) {
        var tabKeys = Object.keys(this.tabs);

        if (tabKeys.length > 0) {
          this.activeTab = tabKeys[0];
        }
      }
    },

    insertTab: function(config) {
      var id = Neo.ifNull(config.id, new Error("tab 'id' missing"), "string");
      var title = Neo.ifNull(config.title, this.UNTITLED, "string");
      var active = Neo.ifNull(config.active, false, "boolean");
      var canRender = Neo.ifNull(config.canRender, true, "boolean");
      var component = Neo.ifNull(config.component, new Error("tab component missing"), "object");

      if (!canRender) return;

      if (id in this.tabs) {
        throw new Error("duplicate tab id found -> " + id);
      }

      var tabTitle = document.createElement("div");
      tabTitle.className = "tabTitle";
      tabTitle.textContent = title;

      tabTitle.addEventListener("click", function() {
        this.activeTab = id;
      }.bind(this));

      this.tabHeader.appendChild(tabTitle);

      var tabComponent = document.createElement("div");
      tabComponent.className = "tabComponent";
      this.tabBody.appendChild(tabComponent);
      component.parent = this;
      component.parentDom = tabComponent;
      Neo.createComponent(component);

      this.tabs[id] = {
        title: tabTitle,
        component: tabComponent
      };

      if (active) {
        this.activeTab = id;
      }
    },

    removeTab: function(id) {
      Neo.typeCheck(id, "string");

      if (!(id in this.tabs)) {
        return;
      }

      this.tabHeader.removeChild(this.tabs[id].title);
      this.tabBody.removeChild(this.tabs[id].component);
      delete this.tabs[id];

      // If we have deleted the active tab, make the first tab active
      if (this._activeTabId === id) {
        var tabKeys = Object.keys(this.tabs);

        if (tabKeys.length > 0) {
          this._activeTabId = null;
          this.activeTab = tabKeys[0];
        }
      }
    },

    get activeTab() {
      return this._activeTabId;
    },

    set activeTab(id) {
      Neo.typeCheck(id, "string");

      if (!(id in this.tabs)) {
        throw new Error("Invalid tab id -> " + id);
      }

      if (this._activeTabId === id) {
        return;
      }

      if (this._activeTabId !== null) {
        this.tabs[this._activeTabId].title.classList.remove(this.ACTIVE);
        this.tabs[this._activeTabId].component.classList.remove(this.ACTIVE);
      }

      this.tabs[id].title.classList.add(this.ACTIVE);
      this.tabs[id].component.classList.add(this.ACTIVE);
      this._activeTabId = id;
    }
  });
}());