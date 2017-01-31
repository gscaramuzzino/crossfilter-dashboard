"use strict";


var PaginationComponent = {
  templateUrl: './components/pagination/pagination.html',
  controller: function () {
    if (typeof this.model == undefined && this.model !== null) {
      this.currentPage = this.model.getCurrentPage();
    }
    this.changePage = function () {
      this.model.setCurrentPage(this.currentPage);
      this.model.changePage();
    }; //changePage
  },
  controllerAs: 'pagCtrl',
  bindings: {
    model: '='
  }
};

angular.module("AppModule").component("paginationComponent", PaginationComponent);