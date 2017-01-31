describe('Unit: Service Test', function () {

  beforeEach(module("ngRoute"));
  beforeEach(module("AppModule"));

  beforeEach(inject(function (PatientsSummaryService, _$httpBackend_) {
    service = PatientsSummaryService;
    $httpBackend = _$httpBackend_; // angular strips the underscores so
  }));

  describe('PatientsSummaryService: getActivities', function () {

    it('should invoke GET service', function () {
      var mockData = {
        "data": [
          {
            "activity": "sleeping",
            "intensity": "none"
            },
          {
            "activity": "stationary-awake",
            "intensity": "low"
            },
          {
            "activity": "walking",
            "intensity": "moderate"
            },
          {
            "activity": "cycling",
            "intensity": "moderate"
            },
          {
            "activity": "swimming",
            "intensity": "vigorous"
            },
          {
            "activity": "running",
            "intensity": "vigorous"
            }
          ]
      };

      //$httpBackend.expectGET('mock-api-data/definitions/activities.json').respond(mockData);

      function callback(data) {
        expect(data.data).not.toBeNull();
      };

      function error(data) {};

      //service.getActivities(callback, error);
      //$httpBackend.flush();
    });

  });

  describe('PatientsSummaryService: getDataPatient', function () {

    it('should invoke GET service', function () {
      var mockData = {
        "data": [
          {
            "activity": "sleeping",
            "minutes": 540
            },
          {
            "activity": "walking",
            "minutes": 75
            },
          {
            "activity": "stationary-awake",
            "minutes": 765
            },
          {
            "activity": "swimming",
            "minutes": 60
            }
          ]
      };

      //$httpBackend.expectGET('mock-api-data/patients/1/summary.json').respond(mockData);

      function callback(data) {
        expect(data.data).not.toBeNull();
      };

      function error(data) {};

      //service.getDataPatient("1", callback, error);
      //$httpBackend.flush();
    });

  });

});
