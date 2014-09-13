'use strict';

// Tshirts controller
angular.module('tshirts').controller('TshirtsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Tshirts',
  function($scope, $stateParams, $location, Authentication, Tshirts ) {
    $scope.authentication = Authentication;

    // Create new Tshirt
    $scope.create = function() {
      // Create new Tshirt object
      var tshirt = new Tshirts ({
        name: this.name
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
    $scope.update = function() {
      var tshirt = $scope.tshirt ;

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
  }
]);
