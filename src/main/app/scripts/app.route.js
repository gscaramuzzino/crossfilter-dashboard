"use strict";

angular.module("AppModule").config(ConfigRoutes);

ConfigRoutes.$inject = ['$routeProvider', '$httpProvider'];

function ConfigRoutes(routeProvider, httpProvider) {

  routeProvider
    .when("/dashboard", {
      templateUrl: "private/view/dashboard.do",
      controller: "DashboardController",
      controllerAs: 'dashCtrl',
      resolve: {
        dataR3: ['DashboardService', function (DashboardService) {
          return DashboardService.getR3Data();
        }]
      }
    })
    .otherwise({
      redirectTo: "/dashboard",
    })
}; //configRoutes