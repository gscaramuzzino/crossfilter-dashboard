"use strict";

angular.module("AppModule").factory('AppDataModel', AppDataModel);

AppDataModel.$inject = ["$filter"];

function AppDataModel(filter) {


  var model = function () {

    var data = [],
      dataToView = [],
      showDetails = false,
      fields = {},
      extraFields = {},
      pagination = {
        elementPerPage: "10",
        currentPage: 1,
        maxSize: 5
      },
      sort = {
        predicate: '',
        reverse: false
      };

    this.orderData = function () {
      if (!this.isEmpty()) {
        data = filter('orderBy')(data, sort.predicate, sort.reverse);
      }
    }; // orderData

    this.changePage = function () {
      if (!this.isEmpty()) {
        var start = (pagination.currentPage - 1) * pagination.elementPerPage;
        var end = pagination.currentPage * pagination.elementPerPage;
        dataToView = data.slice(start, end);
      }
    }; // changePage

    this.isEmpty = function () {
      return data == null || data.length == 0;
    }; //isEmpty

    this.changePredicate = function (colName) {
      if (!this.isEmpty()) {
        sort.predicate = colName;
        sort.reverse = !sort.reverse;
        this.orderData();
        this.changePage();
      }
    }; // changePredicate

    this.isAscPredicate = function (colName) {
      return sort.predicate == colName && sort.reverse == true;
    }; // isAscPredicate

    this.isDescPredicate = function (colName) {
      return sort.predicate == colName && sort.reverse == false;
    }; // isDescPreidicate

    this.add = function (element) {
      data.push(element);
    }; // add

    this.concat = function (array) {
      data.concat(array);
    }; //concat

    this.setData = function (entry) {
      data = entry;
    }; //setData

    this.getData = function () {
      return data;
    }; //getData

    this.createDataToView = function () {
      this.orderData();
      this.changePage();
      dataToView = dataToView;
    };

    this.getDataToView = function () {
      return dataToView;
    }; //getDataToView

    this.setFields = function (entry) {
      fields = entry;
    }; //setFields

    this.getFields = function () {
      return fields;
    }; //getFields

    this.getPagination = function () {
      return pagination;
    }; //getPagination

    this.setElementPerPage = function (entry) {
      pagination.elementPerPage = entry;
    }; //setElementPerPage

    this.getElementPerPage = function () {
      return pagination.elementPerPage;
    }; //setElementPerPage

    this.setCurrentPage = function (entry) {
      pagination.currentPage = entry;
    }; //setCurrentPage

    this.getCurrentPage = function () {
      return pagination.currentPage;
    }; //getCurrentPage

    this.setMaxSize = function (entry) {
      pagination.maxSize = entry;
    }; //setMaxSize

    this.getMaxSize = function () {
      return pagination.maxSize;
    }; //getMaxSize

    this.getSort = function () {
      return sort;
    }; //getSort

    this.setPredicate = function (entry) {
      sort.predicate = entry;
    }; //setPredicate

    this.getPredicate = function () {
      return sort.predicate;
    }; //setPredicate

    this.getReverse = function (entry) {
      return sort.reverse;
    }; //getReverse

    this.setReverse = function (entry) {
      sort.reverse = entry;
    }; //setPredicate

    this.getTotalElements = function () {
      return data.length;
    }; //getTotalElements 
  };

  return {
    getInstance: function () {
      return new model();
    }
  };

}; //AppDataModel