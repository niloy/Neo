(function() {
  "use strict";

  Neo.Classes.Pager = Neo.Classes.UIComponent.extend({
    FIRST_LABEL: "First",
    PREVIOUS_LABEL: "Previous",
    NEXT_LABEL: "Next",
    LAST_LABEL: "Last",
    ACTIVE_PAGE: "activePage",
    PAGE_WIDTH: 48,
    MAX_DISPLAY_PAGES: 10,
    ACTIVE_INDICATOR: "active",

    init: function(config) {
      this._totalPages = Neo.ifNull(config.totalPages, null, "number");
      this._currentPage = Neo.ifNull(config.currentPage, null, "number");
      this.pager = null;
      this.firstButton = null;
      this.previousButton = null;
      this.nextButton = null;
      this.lastButton = null;
      this.pages = null;
      this.pagesContainerInner = null;
      this.leftIndicator = null;
      this.rightIndicator = null;

      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var ul = document.createElement("ul");
      this.pager = ul;
      return ul;
    },

    _renderPager: function() {
      this.pages = [null];

      while (this.pager.childNodes.length) {
        this.pager.removeChild(this.pager.firstChild);
      }

      this.firstButton = document.createElement("div");
      this.firstButton.className = "first pageButton";
      this.firstButton.textContent = this.FIRST_LABEL;
      this.firstButton.addEventListener("click", function() {
        this.first();
      }.bind(this));
      this.pager.appendChild(this.firstButton);

      this.previousButton = document.createElement("div");
      this.previousButton.className = "previous pageButton";
      this.previousButton.textContent = this.PREVIOUS_LABEL;
      this.previousButton.addEventListener("click", function() {
        this.previous();
      }.bind(this));
      this.pager.appendChild(this.previousButton);

      this.leftIndicator = document.createElement("div");
      this.leftIndicator.className = "leftIndicator";
      this.pager.appendChild(this.leftIndicator);

      var pagesContainer = document.createElement("div");
      pagesContainer.className = "pagesContainer";
      pagesContainer.style.width = (this.PAGE_WIDTH * this.MAX_DISPLAY_PAGES) + "px";
      this.pager.appendChild(pagesContainer);

      this.pagesContainerInner = document.createElement("div");
      this.pagesContainerInner.className = "pagesContainerInner";
      this.pagesContainerInner.style.width = (this.PAGE_WIDTH * this._totalPages) + "px";
      pagesContainer.appendChild(this.pagesContainerInner);

      for (var i = 0; i < this._totalPages; i++) {
        var page = document.createElement("div");
        var pageNo = i + 1;
        page.className = "page pageButton";
        page.textContent = pageNo;
        page.style.width = this.PAGE_WIDTH + "px";
        this.pagesContainerInner.appendChild(page);
        this.pages.push(page);
        page.addEventListener("click", this._pageClicked.bind(this, pageNo));
      }

      this.rightIndicator = document.createElement("div");
      this.rightIndicator.className = "rightIndicator";
      this.pager.appendChild(this.rightIndicator);

      this.nextButton = document.createElement("div");
      this.nextButton.className = "next pageButton";
      this.nextButton.textContent = this.NEXT_LABEL;
      this.nextButton.addEventListener("click", function() {
        this.next();
      }.bind(this));
      this.pager.appendChild(this.nextButton);

      this.lastButton = document.createElement("div");
      this.lastButton.className = "last pageButton";
      this.lastButton.textContent = this.LAST_LABEL;
      this.lastButton.addEventListener("click", function() {
        this.last();
      }.bind(this));
      this.pager.appendChild(this.lastButton);
    },

    get totalPages() {
      return this._totalPages;
    },

    set totalPages(value) {
      Neo.typeCheck(value, "number");
      this._totalPages = value;
      this._renderPager();
    },

    get currentPage() {
      return this._currentPage;
    },

    set currentPage(value) {
      Neo.typeCheck(value, "number");

      if (value < 1 || value > this._totalPages) {
        throw new Error("page value is out of bounds");
      }

      if (this._currentPage !== null) {
        this.pages[this._currentPage].classList.remove(this.ACTIVE_PAGE);
      }

      this._currentPage = value;
      this.pages[this._currentPage].classList.add(this.ACTIVE_PAGE);

      var HALF_WINDOW = Math.floor(this.MAX_DISPLAY_PAGES / 2);
      var MIN = 1;
      var MAX = this._totalPages - this.MAX_DISPLAY_PAGES + 1;
      var startIndex = Math.max(this._currentPage - HALF_WINDOW, MIN);
      startIndex = Math.min(startIndex, MAX);
      var margin = (startIndex - 1) * this.PAGE_WIDTH;
      this.pagesContainerInner.style.marginLeft = "-" + margin + "px";
      this._adjustIndicators(startIndex, MIN, MAX);
    },

    next: function() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },

    previous: function() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    first: function() {
      this.currentPage = 1;
    },

    last: function() {
      this.currentPage = this.totalPages;
    },

    _pageClicked: function(pageNo) {
      this.currentPage = pageNo;
      this.trigger("pageChangeRequest");
    },

    _adjustIndicators: function(startIndex, min, max) {
      this.leftIndicator.classList.remove(this.ACTIVE_INDICATOR);
      this.rightIndicator.classList.remove(this.ACTIVE_INDICATOR);

      if (startIndex > min) {
        this.leftIndicator.classList.add(this.ACTIVE_INDICATOR);
      }

      if (startIndex < max) {
        this.rightIndicator.classList.add(this.ACTIVE_INDICATOR);
      }
    }
  });
}());