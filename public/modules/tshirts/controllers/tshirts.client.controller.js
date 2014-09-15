'use strict';

// Tshirts controller
angular.module('tshirts').controller('TshirtsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Tshirts',
  '$filter', 'ngTableParams', '$timeout',
  function($scope, $stateParams, $location, Authentication, Tshirts,
           $filter, NgTableParams, $timeout) {
    $scope.authentication = Authentication;
    $scope.variants = [];

    // Create new Tshirt
    $scope.create = function() {
      // Create new Tshirt object
      var tshirt = new Tshirts ({
        name: this.name,
        frontImageUrl: this.frontImage,
        backImageUrl: this.backImage,
        variants: this.variants
      });

      // Redirect after save
      tshirt.$save(function(response) {
        $location.path('tshirts/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Remove existing Tshirt
    $scope.remove = function( tshirt ) {
      if ( tshirt ) {
        tshirt.$remove();

        for (var i in $scope.tshirts ) {
          if ($scope.tshirts [i] === tshirt ) {
            $scope.tshirts.splice(i, 1);
          }
        }
      } else {
        $scope.tshirt.$remove(function() {
          $location.path('tshirts');
        });
      }
    };

    // Update existing Tshirt
    $scope.update = function(tshirt0) {
      var tshirt = tshirt0 || $scope.tshirt;

      tshirt.$update(function() {
        $location.path('tshirts/' + tshirt._id);
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Find a list of Tshirts
    $scope.find = function() {
      $scope.tshirts = Tshirts.query();
    };

    // Find existing Tshirt
    $scope.findOne = function() {
      $scope.tshirt = Tshirts.get({
        tshirtId: $stateParams.tshirtId
      });
    };

    $scope.addTshirtVariant = function() {
      console.log("niux");
      $scope.variants.push({
        name: "",
        description: "",
        baseCost: 0,
        unit: ['SEK'],
        colors: []
      });
    }

    $scope.tshirtsTableParams = new NgTableParams(
      {
        page: 1,
        count: 10
      },
      {
        total: 0,
        getData: function($defer, params) {
          $timeout(function() {
            var orderedData = params.filter() ?
              $filter('filter')($scope.tshirts, params.filter()) : $scope.tshirts;

            $scope.presentedTshirts = orderedData;

            params.total($scope.presentedTshirts.length);
            $defer.resolve($scope.presentedTshirts);
          }, 500);
        }
      }
    );

    $scope.onSave = function(tshirt) {
      tshirt.$edit = false;
      $scope.update(tshirt);
    };

    $scope.onEdit = function(tshirt) {
      tshirt.$edit = true;
    };

  }
]);
