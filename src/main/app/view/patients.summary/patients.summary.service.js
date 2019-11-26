"use strict";

angular.module("AppModule").factory("PatientsSummaryService", PatientsSummaryService);

PatientsSummaryService.$inject = ["$http"];

function PatientsSummaryService(http) {
  var urlDataPatitent = "mock-api-data/patients/",
    urlActivities = "mock-api-data/definitions/activities.json";

  return {
    getDataPatient: getDataPatient,
    getActivities: getActivities
  };

  function getDataPatient(id) {

    var urlData = urlDataPatitent + id + "/summary.json";
    return actionCall(urlData);
  }; //getDataPatient

  function getActivities() {
    return actionCall(urlActivities);
  }; //getActivities

  //generic ajax call
  function actionCall(url) {
    var promise = http.get(url);

    promise.success(function (response) {
      return response;
    });

    promise.error(function (response) {
      return response;
    });

    return promise;
  }; //actionCall

}; //PatientsSummaryService
