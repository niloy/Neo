(function() {
  "use strict";

  Neo.registerClass("DataTable", "Table", {
    buildDOM: function() {
      var self = this;

      this.dom.classList.add("neoTable");
      Neo.Classes.Table.prototype.buildDOM.call(this);

      var pagerContainer = document.createElement("div");
      pagerContainer.classList.add("pagerContainer");
      this.dom.appendChild(pagerContainer);

      this.pager = this.appendComponent({
        name: "Pager",
        parentDom: pagerContainer
      });
    },

    get totalPages() {
      return this.pager.totalPages;
    },

    set totalPages(value) {
      this.pager.totalPages = value;
    },

    get currentPage() {
      return this.pager.currentPage;
    },

    set currentPage(value) {
      this.pager.currentPage = value;
    },

    markLoading: function(pageNo) {
      if (this.pager.loading === null) {
        this.pager.markLoading(pageNo);
      }
    },

    unmarkLoading: function() {
      this.pager.unmarkLoading();
    }
  });
}());
