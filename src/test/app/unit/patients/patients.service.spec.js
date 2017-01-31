describe('Unit: Service Test', function () {

  beforeEach(module("ngRoute"));
  beforeEach(module("AppModule"));

  beforeEach(inject(function (PatientsService, _$httpBackend_) {
    service = PatientsService;
    $httpBackend = _$httpBackend_; // angular strips the underscores so
  }));

  describe('PatientsService: getData', function () {

    it('should invoke GET service', function () {
      var mockData = {
        "data": [{
          "id": 1,
          "name": "Gregor van Vloten",
          "gender": "male",
          "birthDate": "1986-05-09",
          "heightCm": 193,
          "weightKg": 69.6,
          "bmi": 18.6
         }]
      };

      //$httpBackend.expectGET('mock-api-data/patients.json').respond(mockData);

      function callback(data) {
        expect(data.data).not.toBeNull();
      };

      function error(data) {};

      //service.getData(callback, error);
      //$httpBackend.flush();
    });

  });

});
