"use strict";
angular.module("AppModule").controller("PatientsSummaryController", PatientsSummaryController);

PatientsSummaryController.$inject = ["$routeParams", "$filter", "PatientsSummaryService"];

function PatientsSummaryController(routeParams, filter, service) {
  var vm = this;
  var chart = null;
  vm.definitionActivity = null;
  vm.patientActivity = null;
  vm.patient = null;
  vm.getPatientImage = getPatientImage;
  vm.showActivityDefintion = false;
  vm.actionOnActivityDefinition = actionOnActivityDefinition;
  vm.convertActivity = convertActivity;

  if (routeParams.patient !== null) {
    vm.patient = JSON.parse(routeParams.patient);

    service.getDataPatient(vm.patient.id).then(function (response) {
      vm.patientActivity = response.data;
      createChartActivity(response.data, 'donut', "#chartDonut", 'right');
    });

    service.getActivities().then(function (response) {
      vm.definitionActivity = response.data;
    });
  }

  function getPatientImage(patient, index) {
    var image = "images/";
    if (patient.gender === "male") {
      image += "male_1";
    } else if (patient.gender === "female") {
      image += "female_1";
    }
    return image + ".png";
  }; //getPatientImage

  //create activity chart usign c3 libs
  function createChartActivity(jsonData, type, id, position) {
    var json = {};
    //parse data to c3 libs
    jsonData.forEach(function (item) {
      json[item.activity] = [item.minutes];
    });

    var chart = c3.generate({
      bindto: id,
      data: {
        json: json,
        type: type
      },
      legend: {
        position: position
      }
    });
  }; //createChartActivity

  function actionOnActivityDefinition() {
    vm.showActivityDefintion = !vm.showActivityDefintion;
  }; //actionOnActivityDefinition

  function convertActivity(minutes) {
    return minutes < 60 ? minutes + " min" : filter('number')(minutes / 60, 2) + " h";
  }; //convertActivity

};
