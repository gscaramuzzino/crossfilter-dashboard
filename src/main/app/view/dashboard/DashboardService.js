"use strict";

angular.module("AppModule").factory("DashboardService", DashboardService);

DashboardService.$inject = ["$http"];

function DashboardService(http) {
  var dashboardFactory = {};

  dashboardFactory.getR3Data = function () {

    var promise = http.get("private/view/getR2.do", {
      myOptions: {
        'overlay': true
      }
    });

    promise.success(function (response) {
      return response;
    });

    promise.error(function (response) {
      return response;
    });

    return promise;

  }

  return dashboardFactory;

}; //DashboardService