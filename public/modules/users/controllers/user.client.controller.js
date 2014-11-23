'use strict';

angular.module('users').controller('UserController', [
  '$scope', 'Authentication', '$location', '$state',
  function($scope, Authentication, $location, $state) {
    $scope.authentication = Authentication;

    // check if a user is authenticated
    $scope.ensureAuthenticated = Authentication.ensureAuthenticated;
  }
]);
