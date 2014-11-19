'use strict';

angular.module('users').controller('UserController', [
  '$scope', 'Authentication', '$location', '$state',
  function($scope, Authentication, $location, $state) {
    $scope.authentication = Authentication;

    // check if a user is authenticated
    $scope.ensureAuthenticated = function() {
      if(!$scope.authentication.user) {
        $location.path('signin');
      }
    };
  }
]);
