'use strict';

(function() {
  // Tshirts Controller Spec
  describe('Tshirts Controller Tests', function() {
    // Initialize global variables
    var TshirtsController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

    // The $resource service augments the response object with methods for updating and deleting
    // the resource. If we were to use the standard toEqual matcher, our tests would fail
    // because the test values would not match the responses exactly. To solve the problem, we
    // define a new toEqualData Jasmine matcher. When the toEqualData matcher compares two objects,
    // it takes only object properties into account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(
      function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;

        // Initialize the Tshirts controller.
        TshirtsController = $controller('TshirtsController', {
          $scope: scope
        });
      }));

    it('$scope.find() should create an array with at least one Tshirt ' +
       'object fetched from XHR',
       inject(
         function(Tshirts) {
           // Create sample Tshirt using the Tshirts service
           var sampleTshirt = new Tshirts({
             name: 'New Tshirt'
           });

           // Create a sample Tshirts array that includes the new Tshirt
           var sampleTshirts = [sampleTshirt];

           // Set GET response
           $httpBackend.expectGET('tshirts').respond(sampleTshirts);

           // Run controller functionality
           scope.find();
           $httpBackend.flush();

           // Test scope value
           expect(scope.tshirts).toEqualData(sampleTshirts);
         })
      );

    it('$scope.findOne() should create an array with one Tshirt object fetched ' +
       'from XHR using a tshirtId URL parameter',
       inject(
         function(Tshirts) {
           // Define a sample Tshirt object
           var sampleTshirt = new Tshirts({
             name: 'New Tshirt'
           });

           // Set the URL parameter
           $stateParams.tshirtId = '525a8422f6d0f87f0e407a33';

           // Set GET response
           $httpBackend.expectGET(/tshirts\/([0-9a-fA-F]{24})$/).respond(sampleTshirt);

           // Run controller functionality
           scope.findOne();
           $httpBackend.flush();

           // Test scope value
           expect(scope.tshirt).toEqualData(sampleTshirt);
         })
      );

    it('$scope.create() with valid form data should send a POST request with the form ' +
       'input values and then locate to new object URL',
       inject(
         function(Tshirts) {
           // Create a sample Tshirt object
           var variant = {
             name: 'variant_1',
             description: 'description_1',
             baseCost: 0,
             currency: 'SEK',
             colors: ['black']
           };

           var frontImageId = 'front_image_id';
           var backImageId = 'back_image_id';
           var sampleTshirtPostData = new Tshirts({
             name: 'New Tshirt',
             frontImage: frontImageId,
             backImage: backImageId,
             variants: [variant]
           });

           var frontImageResponse = {_id: frontImageId};
           var backImageResponse = {_id: backImageId};

           // Create a sample Tshirt response
           var sampleTshirtResponse = new Tshirts({
             _id: '525cf20451979dea2c000001',
             name: 'New Tshirt'
           });

           // Fixture mock form input values
           scope.name = 'New Tshirt';
           scope.tmpVariant = variant;

           scope.currentQueueItemFront = {
             upload: function() {
               scope.currentQueueItemFront.onSuccess(frontImageResponse);
             }
           };

           scope.currentQueueItemBack = {
             upload: function() {
               scope.currentQueueItemBack.onSuccess(backImageResponse);
             }
           };

           // Set POST response
           $httpBackend.expectPOST('tshirts', sampleTshirtPostData).respond(sampleTshirtResponse);

           // Run controller functionality
           scope.create();
           $httpBackend.flush();

           // Test form inputs are reset
           expect(scope.name).toEqual('');

           // Test URL redirection after the Tshirt was created
           expect($location.path()).toBe('/admin/tshirts/' + sampleTshirtResponse._id);
         })
      );

    it('$scope.update() should update a valid Tshirt', inject(
      function(Tshirts) {
        // Define a sample Tshirt put data
        var sampleTshirtPutData = new Tshirts({
          _id: '525cf20451979dea2c000001',
          name: 'New Tshirt'
        });

        // Mock Tshirt in scope
        scope.tshirt = sampleTshirtPutData;

        // Set PUT response
        $httpBackend.expectPUT(/tshirts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Url should not change because it stays in the same admin page
        expect($location.path()).toBe('');
      }));

    it('$scope.remove() should send a DELETE request with a valid tshirtId '+
       'and remove the Tshirt from the scope',
       inject(
         function(Tshirts) {
           // Create new Tshirt object
           var sampleTshirt = new Tshirts({
             _id: '525a8422f6d0f87f0e407a33'
           });

           // Create new Tshirts array and include the Tshirt
           scope.tshirts = [sampleTshirt];

           // Set expected DELETE response
           $httpBackend.expectDELETE(/tshirts\/([0-9a-fA-F]{24})$/).respond(204);

           // Run controller functionality
           scope.remove(sampleTshirt);
           $httpBackend.flush();

           // Test array after successful delete
           expect(scope.tshirts.length).toBe(0);
         })
      );
  });
}());
