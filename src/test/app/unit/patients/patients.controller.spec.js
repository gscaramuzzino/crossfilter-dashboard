describe("Unit: Controller Test", function () {
  var controller, PatientsService;

  beforeEach(module("ngRoute"));

  beforeEach(module("AppModule"), function($provide) {
    $provide.value('PatientsService', {
      getData: function () {}
    });
  });

  var $controller;
  beforeEach(inject(function (_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  var PatientsController,
    scope, $q, deferred;
  // Initialize the controller and a mock scope
  // spy the service to simulate the promise
  beforeEach(inject(function ($controller, $rootScope, _$q_, PatientsService) {
    scope = $rootScope.$new();
    scope = $rootScope.$new();
    $q = _$q_;
    // We use the $q service to create a mock instance of defer
    deferred = _$q_.defer();
    // Use a Jasmine Spy to return the deferred promise
    spyOn(PatientsService, 'getData').and.returnValue(deferred.promise);

    PatientsController = $controller('PatientsController', {
    });

  }));

  describe('Controller: PatientsController', function () {
      // finally, why start the test
      it('PatientsController should not be null', inject(function ($controller) {
        expect(PatientsController).not.toBeNull();
      }));

      it('patientsFilters should be null', inject(function ($controller) {
        expect(PatientsController.patientsFilters).toBeNull();
      }));

      it('showFilters should be false', inject(function ($controller) {
        expect(PatientsController.showFilters).toBeFalsy();
      }));

      it('should resolve promise, patients should not be null', function () {
        // Setup the data we wish to return for the .then function in the controller
        deferred.resolve({
          "data": [{
            "id": 1,
            "name": "Gregor van Vloten",
            "gender": "male",
            "birthDate": "1986-05-09",
            "heightCm": 193,
            "weightKg": 69.6,
            "bmi": 18.6
           }]
        });
        // We have to call apply for this to work
        scope.$apply();
        // Since we called apply, not we can perform our assertions
        expect(PatientsController.patientsFilters).not.toBeNull();
      });

      it('should resolve promise, patients  length should == 1', function () {
        // Setup the data we wish to return for the .then function in the controller
        deferred.resolve({
          "data": [{
            "id": 1,
            "name": "Gregor van Vloten",
            "gender": "male",
            "birthDate": "1986-05-09",
            "heightCm": 193,
            "weightKg": 69.6,
            "bmi": 18.6
           }]
        });
        // We have to call apply for this to work
        scope.$apply();
        // Since we called apply, not we can perform our assertions
        expect(PatientsController.patientsFilters.length).toEqual(1);
      });

       it('image path should be male_1.png', inject(function ($controller) {
        var patient = {
          "id": 1,
          "name": "Gregor van Vloten",
          "gender": "male",
          "birthDate": "1986-05-09",
          "heightCm": 193,
          "weightKg": 69.6,
          "bmi": 18.6
         };
        var image = PatientsController.getPatientImage(patient, 1);
        expect(image).toEqual("images/male_1.png");
      }));

      it('showFilters should be true', inject(function ($controller) {
        PatientsController.actionOnFilter();
        scope.$apply();
        expect(PatientsController.showFilter).toBeTruthy();
      }));

       it('reverse.order should be true', inject(function ($controller) {
        PatientsController.reverseOrder();
        scope.$apply();
        expect(PatientsController.order.reverse).toBeTruthy();
      }));

      it('patientsFilters size should be 1', function () {
        // Setup the data we wish to return for the .then function in the controller
        deferred.resolve({
          "complete": true,
          "data": [{
            "id": 1,
            "name": "Gregor van Vloten",
            "gender": "male",
            "birthDate": "1986-05-09",
            "heightCm": 193,
            "weightKg": 69.6,
            "bmi": 18.6
           },
           {
            "id": 2,
            "name": "Susanne Marcil",
            "gender": "female",
            "birthDate": "1984-11-18",
            "heightCm": 159,
            "weightKg": 102.8,
            "bmi": 40.6
          }]
        });
        scope.$apply();

        // We have to call apply for this to work
        PatientsController.filters.gender = "male";
        PatientsController.filters.heightCm = "193";
        PatientsController.applyFilters();
        scope.$apply();

        // Since we called apply, not we can perform our assertions
        expect(PatientsController.patientsFilters.length).toEqual(1);
      });

      it('patientsFilters size should not be 1', function () {
        // Setup the data we wish to return for the .then function in the controller
        deferred.resolve({
          "complete": true,
          "data": [{
            "id": 1,
            "name": "Gregor van Vloten",
            "gender": "male",
            "birthDate": "1986-05-09",
            "heightCm": 193,
            "weightKg": 69.6,
            "bmi": 18.6
           },
           {
            "id": 2,
            "name": "Susanne Marcil",
            "gender": "female",
            "birthDate": "1984-11-18",
            "heightCm": 159,
            "weightKg": 102.8,
            "bmi": 40.6
          }]
        });
        scope.$apply();

        // We have to call apply for this to work
        PatientsController.filters.gender = "female";
        PatientsController.filters.heightCm = "193";
        PatientsController.applyFilters();
        scope.$apply();

        // Since we called apply, not we can perform our assertions
        expect(PatientsController.patientsFilters.length).not.toEqual(1);
      });

  });

});